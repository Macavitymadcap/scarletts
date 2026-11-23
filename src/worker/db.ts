import { Temporal } from 'temporal-polyfill';
import type { Gig } from '../content/gigs';

/**
 * The subset of Cloudflare's D1 API the crew area uses. Declared here rather
 * than pulled from workers-types, whose globals clash with Bun's, and so tests
 * can back it with bun:sqlite.
 */
export interface Statement {
	bind(...values: (string | number | null)[]): Statement;
	first<T>(): Promise<T | null>;
	all<T>(): Promise<{ results: T[] }>;
	run(): Promise<unknown>;
}

export interface Database {
	prepare(query: string): Statement;
}

export type Member = { email: string; name: string };

export type EventKind = 'gig' | 'rehearsal' | 'other';
export const eventKinds: readonly EventKind[] = ['gig', 'rehearsal', 'other'];

export type TicketStatus = NonNullable<Gig['ticket']>['status'];
export const ticketStatuses: readonly TicketStatus[] = ['on-sale', 'sold-out'];

export type EventInput = {
	date: string;
	startTime: string | null;
	endTime: string | null;
	title: string;
	kind: EventKind;
	venue: string | null;
	city: string | null;
	details: string | null;
	ticketStatus: TicketStatus | null;
	ticketHref: string | null;
	eventHref: string | null;
	isPublic: boolean;
};

export type CrewEvent = EventInput & {
	id: number;
	updatedBy: string;
	updatedAt: string;
};

export type Unavailability = { date: string; email: string; name: string };

type EventRow = {
	id: number;
	date: string;
	start_time: string | null;
	end_time: string | null;
	title: string;
	kind: EventKind;
	venue: string | null;
	city: string | null;
	details: string | null;
	ticket_status: TicketStatus | null;
	ticket_href: string | null;
	event_href: string | null;
	public: number;
	updated_by_name: string;
	updated_at: string;
};

const EVENT_COLUMNS = `e.id, e.date, e.start_time, e.end_time, e.title, e.kind,
	e.venue, e.city, e.details, e.ticket_status, e.ticket_href, e.event_href,
	e.public, e.updated_at, COALESCE(m.name, e.updated_by) AS updated_by_name
	FROM events e LEFT JOIN members m ON m.email = e.updated_by`;

const toEvent = (row: EventRow): CrewEvent => ({
	id: row.id,
	date: row.date,
	startTime: row.start_time,
	endTime: row.end_time,
	title: row.title,
	kind: row.kind,
	venue: row.venue,
	city: row.city,
	details: row.details,
	ticketStatus: row.ticket_status,
	ticketHref: row.ticket_href,
	eventHref: row.event_href,
	isPublic: row.public === 1,
	updatedBy: row.updated_by_name,
	updatedAt: row.updated_at,
});

const inputValues = (input: EventInput) => [
	input.date,
	input.startTime,
	input.endTime,
	input.title,
	input.kind,
	input.venue,
	input.city,
	input.details,
	input.ticketStatus,
	input.ticketHref,
	input.eventHref,
	input.isPublic ? 1 : 0,
];

export const findMember = (
	db: Database,
	email: string,
): Promise<Member | null> =>
	db
		.prepare('SELECT email, name FROM members WHERE email = ?')
		.bind(email)
		.first<Member>();

export const eventsBetween = async (
	db: Database,
	from: string,
	to: string,
): Promise<CrewEvent[]> => {
	const { results } = await db
		.prepare(
			`SELECT ${EVENT_COLUMNS} WHERE e.date BETWEEN ? AND ?
			ORDER BY e.date, e.start_time IS NOT NULL, e.start_time, e.id`,
		)
		.bind(from, to)
		.all<EventRow>();
	return results.map(toEvent);
};

export const eventsFrom = async (
	db: Database,
	from: string,
): Promise<CrewEvent[]> => {
	const { results } = await db
		.prepare(`SELECT ${EVENT_COLUMNS} WHERE e.date >= ? ORDER BY e.date, e.id`)
		.bind(from)
		.all<EventRow>();
	return results.map(toEvent);
};

export const getEvent = async (
	db: Database,
	id: number,
): Promise<CrewEvent | null> => {
	const row = await db
		.prepare(`SELECT ${EVENT_COLUMNS} WHERE e.id = ?`)
		.bind(id)
		.first<EventRow>();
	return row ? toEvent(row) : null;
};

export const createEvent = async (
	db: Database,
	input: EventInput,
	by: string,
	now: Temporal.Instant = Temporal.Now.instant(),
): Promise<number> => {
	const row = await db
		.prepare(
			`INSERT INTO events (date, start_time, end_time, title, kind, venue, city,
			details, ticket_status, ticket_href, event_href, public, updated_by, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
		)
		.bind(...inputValues(input), by, now.toString())
		.first<{ id: number }>();
	if (!row) throw new Error('Insert returned no id');
	return row.id;
};

export const updateEvent = async (
	db: Database,
	id: number,
	input: EventInput,
	by: string,
	now: Temporal.Instant = Temporal.Now.instant(),
): Promise<void> => {
	await db
		.prepare(
			`UPDATE events SET date = ?, start_time = ?, end_time = ?, title = ?,
			kind = ?, venue = ?, city = ?, details = ?, ticket_status = ?,
			ticket_href = ?, event_href = ?, public = ?, updated_by = ?, updated_at = ?
			WHERE id = ?`,
		)
		.bind(...inputValues(input), by, now.toString(), id)
		.run();
};

export const deleteEvent = async (db: Database, id: number): Promise<void> => {
	await db.prepare('DELETE FROM events WHERE id = ?').bind(id).run();
};

export const unavailabilityBetween = async (
	db: Database,
	from: string,
	to: string,
): Promise<Unavailability[]> => {
	const { results } = await db
		.prepare(
			`SELECT u.date, u.email, m.name FROM unavailability u
			JOIN members m ON m.email = u.email
			WHERE u.date BETWEEN ? AND ? ORDER BY u.date, m.name`,
		)
		.bind(from, to)
		.all<Unavailability>();
	return results;
};

/** Marks the member unavailable on the date, or available again if they already were. */
export const toggleUnavailable = async (
	db: Database,
	email: string,
	date: string,
): Promise<void> => {
	const removed = await db
		.prepare(
			'DELETE FROM unavailability WHERE email = ? AND date = ? RETURNING date',
		)
		.bind(email, date)
		.first<{ date: string }>();
	if (removed) return;
	await db
		.prepare('INSERT INTO unavailability (email, date) VALUES (?, ?)')
		.bind(email, date)
		.run();
};

export const feedTokenFor = async (
	db: Database,
	email: string,
): Promise<string | null> => {
	const row = await db
		.prepare('SELECT token FROM feed_tokens WHERE email = ?')
		.bind(email)
		.first<{ token: string }>();
	return row?.token ?? null;
};

export const saveFeedToken = async (
	db: Database,
	email: string,
	token: string,
): Promise<void> => {
	await db
		.prepare(
			`INSERT INTO feed_tokens (email, token) VALUES (?, ?)
			ON CONFLICT (email) DO UPDATE SET token = excluded.token`,
		)
		.bind(email, token)
		.run();
};

export const memberForFeedToken = (
	db: Database,
	token: string,
): Promise<Member | null> =>
	db
		.prepare(
			`SELECT m.email, m.name FROM feed_tokens f
			JOIN members m ON m.email = f.email WHERE f.token = ?`,
		)
		.bind(token)
		.first<Member>();
