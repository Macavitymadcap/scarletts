import { type Context, Hono } from 'hono';
import { csrf } from 'hono/csrf';
import { Temporal } from 'temporal-polyfill';
import { accessKeys, type KeySource, verifyAccessJwt } from './access';
import {
	addDays,
	isIsoDate,
	londonToday,
	monthGrid,
	parseMonth,
} from './dates';
import {
	createEvent,
	type Database,
	deleteEvent,
	type EventInput,
	eventsBetween,
	eventsFrom,
	feedTokenFor,
	findMember,
	getEvent,
	type Member,
	memberForFeedToken,
	saveFeedToken,
	toggleUnavailable,
	unavailabilityBetween,
	updateEvent,
} from './db';
import { type FormValues, formValuesFor, parseEventForm } from './event-form';
import { toIcs } from './ics';
import { requestPublish } from './publish';
import { EventPage } from './views/event';
import { MonthPage } from './views/month';
import { type PublishState, SettingsPage } from './views/settings';

export type Env = {
	DB: Database;
	ACCESS_TEAM_DOMAIN: string;
	ACCESS_AUD: string;
	/** Local development only: signs in as this member on localhost. */
	DEV_EMAIL?: string;
	GITHUB_REPO?: string;
	GITHUB_TOKEN?: string;
};

type CrewEnv = { Bindings: Env; Variables: { member: Member } };
type CrewContext = Context<CrewEnv>;

export type AppOptions = {
	keysFor?: (teamDomain: string) => KeySource;
	now?: () => Temporal.Instant;
};

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);
const FEED_HISTORY_DAYS = 180;

const keyCache = new Map<string, KeySource>();
const cachedKeys = (teamDomain: string): KeySource => {
	const existing = keyCache.get(teamDomain);
	if (existing) return existing;
	const keys = accessKeys(teamDomain);
	keyCache.set(teamDomain, keys);
	return keys;
};

const newToken = (): string =>
	Array.from(crypto.getRandomValues(new Uint8Array(24)), (byte) =>
		byte.toString(16).padStart(2, '0'),
	).join('');

const formStrings = async (c: CrewContext): Promise<FormValues> => {
	const body = await c.req.parseBody();
	return Object.fromEntries(
		Object.entries(body).flatMap(([key, value]) =>
			typeof value === 'string' ? [[key, value]] : [],
		),
	);
};

/** Redirects after a POST; htmx follows HX-Location without a full reload. */
const goTo = (c: CrewContext, path: string): Response =>
	c.req.header('HX-Request')
		? c.body(null, 200, { 'HX-Location': path })
		: c.redirect(path, 303);

const eventId = (c: CrewContext): number => Number(c.req.param('id'));

const blankEvent = (date: string): EventInput => ({
	date,
	startTime: null,
	endTime: null,
	title: '',
	kind: 'other',
	venue: null,
	city: null,
	details: null,
	ticketStatus: null,
	ticketHref: null,
	eventHref: null,
	isPublic: false,
});

/** Builds the Worker app: the crew area under /crew and calendar feeds under /cal. */
export const createApp = ({
	keysFor = cachedKeys,
	now = () => Temporal.Now.instant(),
}: AppOptions = {}): Hono<{ Bindings: Env }> => {
	const signedInEmail = async (c: CrewContext): Promise<string | null> => {
		const { hostname } = new URL(c.req.url);
		if (c.env.DEV_EMAIL && LOCAL_HOSTS.has(hostname)) return c.env.DEV_EMAIL;

		const token = c.req.header('Cf-Access-Jwt-Assertion');
		if (!token || !c.env.ACCESS_TEAM_DOMAIN || !c.env.ACCESS_AUD) return null;
		const config = {
			teamDomain: c.env.ACCESS_TEAM_DOMAIN,
			audience: c.env.ACCESS_AUD,
		};
		return verifyAccessJwt(token, config, keysFor(config.teamDomain), now());
	};

	const crew = new Hono<CrewEnv>({ strict: false });

	crew.use(async (c, next) => {
		c.header('X-Robots-Tag', 'noindex, nofollow');
		c.header('Cache-Control', 'private, no-store');
		const email = await signedInEmail(c);
		const member = email ? await findMember(c.env.DB, email) : null;
		if (!member) return c.text('Forbidden', 403);
		c.set('member', member);
		await next();
	});
	crew.use(csrf());

	crew.get('/', async (c) => {
		const today = londonToday(now());
		const month = parseMonth(c.req.query('month'), today);
		const days = monthGrid(month).flat();
		const from = days[0]?.date ?? today;
		const to = days.at(-1)?.date ?? today;
		const [events, unavailable] = await Promise.all([
			eventsBetween(c.env.DB, from, to),
			unavailabilityBetween(c.env.DB, from, to),
		]);
		return c.html(
			<MonthPage
				member={c.get('member')}
				month={month}
				today={today}
				events={events}
				unavailable={unavailable}
			/>,
		);
	});

	crew.get('/events/new', (c) => {
		const requested = c.req.query('date') ?? '';
		const date = isIsoDate(requested) ? requested : londonToday(now());
		return c.html(
			<EventPage
				member={c.get('member')}
				values={formValuesFor(blankEvent(date))}
			/>,
		);
	});

	crew.post('/events', async (c) => {
		const values = await formStrings(c);
		const parsed = parseEventForm(values);
		if (!parsed.ok) {
			return c.html(
				<EventPage
					member={c.get('member')}
					values={values}
					errors={parsed.errors}
				/>,
				422,
			);
		}
		await createEvent(c.env.DB, parsed.value, c.get('member').email, now());
		return goTo(c, `/crew?month=${parsed.value.date.slice(0, 7)}`);
	});

	crew.get('/events/:id{[0-9]+}', async (c) => {
		const event = await getEvent(c.env.DB, eventId(c));
		if (!event) return c.notFound();
		return c.html(
			<EventPage
				member={c.get('member')}
				values={formValuesFor(event)}
				event={event}
			/>,
		);
	});

	crew.post('/events/:id{[0-9]+}', async (c) => {
		const event = await getEvent(c.env.DB, eventId(c));
		if (!event) return c.notFound();
		const values = await formStrings(c);
		const parsed = parseEventForm(values);
		if (!parsed.ok) {
			return c.html(
				<EventPage
					member={c.get('member')}
					values={values}
					errors={parsed.errors}
					event={event}
				/>,
				422,
			);
		}
		await updateEvent(
			c.env.DB,
			event.id,
			parsed.value,
			c.get('member').email,
			now(),
		);
		return goTo(c, `/crew?month=${parsed.value.date.slice(0, 7)}`);
	});

	crew.post('/events/:id{[0-9]+}/delete', async (c) => {
		const event = await getEvent(c.env.DB, eventId(c));
		if (!event) return c.notFound();
		await deleteEvent(c.env.DB, event.id);
		return goTo(c, `/crew?month=${event.date.slice(0, 7)}`);
	});

	crew.post('/unavailable/:date', async (c) => {
		const date = c.req.param('date');
		if (!isIsoDate(date)) return c.notFound();
		await toggleUnavailable(c.env.DB, c.get('member').email, date);
		const { month } = await formStrings(c);
		const back = parseMonth(month, date).toString();
		return goTo(c, `/crew?month=${back}`);
	});

	crew.get('/settings', async (c) => {
		const token = await feedTokenFor(c.env.DB, c.get('member').email);
		const origin = new URL(c.req.url).origin;
		const publish = c.req.query('publish');
		const publishStates: PublishState[] = ['sent', 'failed', 'unconfigured'];
		return c.html(
			<SettingsPage
				member={c.get('member')}
				feedUrl={token ? `${origin}/cal/${token}.ics` : null}
				publish={publishStates.find((state) => state === publish)}
				canPublish={Boolean(c.env.GITHUB_REPO && c.env.GITHUB_TOKEN)}
			/>,
		);
	});

	crew.post('/settings/feed', async (c) => {
		await saveFeedToken(c.env.DB, c.get('member').email, newToken());
		return goTo(c, '/crew/settings');
	});

	crew.post('/publish', async (c) => {
		const { GITHUB_REPO: repo, GITHUB_TOKEN: token } = c.env;
		if (!repo || !token) return goTo(c, '/crew/settings?publish=unconfigured');
		const sent = await requestPublish(repo, token).catch(() => false);
		return goTo(c, `/crew/settings?publish=${sent ? 'sent' : 'failed'}`);
	});

	const app = new Hono<{ Bindings: Env }>();
	app.route('/crew', crew);

	app.get('/cal/:file{[0-9a-f]+\\.ics}', async (c) => {
		const token = c.req.param('file').replace(/\.ics$/, '');
		const member = await memberForFeedToken(c.env.DB, token);
		if (!member) return c.notFound();
		const from = addDays(londonToday(now()), -FEED_HISTORY_DAYS);
		const events = await eventsFrom(c.env.DB, from);
		return c.body(toIcs(events, new URL(c.req.url).hostname), 200, {
			'Content-Type': 'text/calendar; charset=utf-8',
			'Cache-Control': 'private, max-age=300',
			'X-Robots-Tag': 'noindex, nofollow',
		});
	});

	return app;
};
