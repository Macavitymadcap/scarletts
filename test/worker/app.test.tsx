import { beforeEach, describe, expect, test } from 'bun:test';
import { Temporal } from 'temporal-polyfill';
import { createApp, type Env } from '../../src/worker/app';
import type { Database } from '../../src/worker/db';
import { testDatabase } from './sqlite-d1';

const LOCAL = 'http://localhost:8787';
const NOW = Temporal.Instant.from('2026-11-23T12:00:00Z');

let db: Database;
let env: Env;

const app = createApp({ keysFor: () => async () => [], now: () => NOW });

const get = (path: string, base = LOCAL) =>
	app.request(`${base}${path}`, {}, env);

const post = (
	path: string,
	form: Record<string, string> = {},
	headers: Record<string, string> = {},
) =>
	app.request(
		`${LOCAL}${path}`,
		{
			method: 'POST',
			body: new URLSearchParams(form),
			headers: { Origin: LOCAL, ...headers },
		},
		env,
	);

const gigForm = {
	title: 'Trinity Centre',
	kind: 'gig',
	date: '2026-12-05',
	startTime: '19:30',
	venue: 'Trinity Centre',
	city: 'Bristol',
	isPublic: 'on',
};

beforeEach(async () => {
	({ db } = await testDatabase());
	await db
		.prepare('INSERT INTO members (email, name) VALUES (?, ?), (?, ?)')
		.bind('dan@example.com', 'Dan', 'sam@example.com', 'Sam')
		.run();
	env = {
		DB: db,
		ACCESS_TEAM_DOMAIN: 'team.cloudflareaccess.com',
		ACCESS_AUD: 'aud',
		DEV_EMAIL: 'dan@example.com',
	};
});

describe('crew access', () => {
	test('refuses requests without an Access token outside localhost', async () => {
		// Arrange
		const base = 'https://scarletts.uk';

		// Act
		const response = await get('/crew', base);

		// Assert
		expect(response.status).toBe(403);
	});

	test('refuses a signed-in address that is not a band member', async () => {
		// Arrange
		env.DEV_EMAIL = 'stranger@example.com';

		// Act
		const response = await get('/crew');

		// Assert
		expect(response.status).toBe(403);
	});

	test('keeps crew pages out of search engines', async () => {
		// Act
		const response = await get('/crew');

		// Assert
		expect(response.status).toBe(200);
		expect(response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
	});

	test('rejects form posts from another site', async () => {
		// Act
		const response = await post('/crew/events', gigForm, {
			Origin: 'https://evil.example',
		});

		// Assert
		expect(response.status).toBe(403);
	});
});

describe('calendar', () => {
	test('shows the requested month with its events', async () => {
		// Arrange
		await post('/crew/events', gigForm);

		// Act
		const html = await (await get('/crew?month=2026-12')).text();

		// Assert
		expect(html).toContain('December 2026');
		expect(html).toContain('Trinity Centre');
		expect(html).toContain('19:30');
	});

	test('creating an event redirects to its month', async () => {
		// Act
		const response = await post('/crew/events', gigForm);

		// Assert
		expect(response.status).toBe(303);
		expect(response.headers.get('Location')).toBe('/crew?month=2026-12');
	});

	test('htmx requests are redirected with HX-Location', async () => {
		// Act
		const response = await post('/crew/events', gigForm, {
			'HX-Request': 'true',
		});

		// Assert
		expect(response.headers.get('HX-Location')).toBe('/crew?month=2026-12');
	});

	test('an invalid event is shown again with the reasons', async () => {
		// Act
		const response = await post('/crew/events', { ...gigForm, title: '' });

		// Assert
		expect(response.status).toBe(422);
		expect(await response.text()).toContain('Give the event a title.');
	});

	test('another member can edit an event and is credited', async () => {
		// Arrange
		await post('/crew/events', gigForm);
		env.DEV_EMAIL = 'sam@example.com';

		// Act
		await post('/crew/events/1', { ...gigForm, title: 'Trinity (moved)' });
		const html = await (await get('/crew/events/1')).text();

		// Assert
		expect(html).toContain('Trinity (moved)');
		expect(html).toContain('Last edited by Sam');
	});

	test('deleting an event removes it from the month', async () => {
		// Arrange
		await post('/crew/events', gigForm);

		// Act
		await post('/crew/events/1/delete');
		const html = await (await get('/crew?month=2026-12')).text();

		// Assert
		expect(html).not.toContain('Trinity Centre');
	});

	test('an unknown event is not found', async () => {
		// Act
		const response = await get('/crew/events/99');

		// Assert
		expect(response.status).toBe(404);
	});
});

describe('availability', () => {
	test('marking a day out shows the member on that day', async () => {
		// Act
		await post('/crew/unavailable/2026-12-10', { month: '2026-12' });
		const html = await (await get('/crew?month=2026-12')).text();

		// Assert
		expect(html).toContain('Out: Dan');
	});

	test('marking the same day again clears it', async () => {
		// Arrange
		await post('/crew/unavailable/2026-12-10', { month: '2026-12' });

		// Act
		await post('/crew/unavailable/2026-12-10', { month: '2026-12' });
		const html = await (await get('/crew?month=2026-12')).text();

		// Assert
		expect(html).not.toContain('Out: Dan');
	});
});

describe('calendar feed', () => {
	const feedPath = async (): Promise<string> => {
		await post('/crew/settings/feed');
		const html = await (await get('/crew/settings')).text();
		const match = html.match(/\/cal\/[0-9a-f]+\.ics/);
		if (!match) throw new Error('No feed link on the settings page');
		return match[0];
	};

	test('serves events to a member feed link without Access', async () => {
		// Arrange
		await post('/crew/events', gigForm);
		const path = await feedPath();

		// Act
		const response = await get(path, 'https://scarletts.uk');

		// Assert
		expect(response.headers.get('Content-Type')).toContain('text/calendar');
		expect(await response.text()).toContain('SUMMARY:Trinity Centre');
	});

	test('making a new link stops the old one working', async () => {
		// Arrange
		const oldPath = await feedPath();
		await post('/crew/settings/feed');

		// Act
		const response = await get(oldPath, 'https://scarletts.uk');

		// Assert
		expect(response.status).toBe(404);
	});
});

describe('publishing', () => {
	test('says so when GitHub is not configured', async () => {
		// Act
		const response = await post('/crew/publish');

		// Assert
		expect(response.headers.get('Location')).toBe(
			'/crew/settings?publish=unconfigured',
		);
	});
});
