import type { Gig } from './gigs';

/** Gigs the band ticked "Show on scarletts.uk" for in the crew calendar. */
export const PUBLIC_GIGS_SQL = `SELECT date, venue, city, details,
	ticket_status, ticket_href, event_href
	FROM events WHERE kind = 'gig' AND public = 1 ORDER BY date`;

export type PublicGigRow = {
	date: string;
	venue: string | null;
	city: string | null;
	details: string | null;
	ticket_status: 'on-sale' | 'sold-out' | null;
	ticket_href: string | null;
	event_href: string | null;
};

export const rowToGig = (row: PublicGigRow): Gig => ({
	date: row.date,
	venue: row.venue ?? '',
	city: row.city ?? '',
	...(row.details && { details: row.details }),
	...(row.ticket_status &&
		row.ticket_href && {
			ticket: { status: row.ticket_status, href: row.ticket_href },
		}),
	...(row.event_href && { eventHref: row.event_href }),
});

const gigKey = (gig: Gig): string =>
	`${gig.date}|${gig.venue.trim().toLowerCase()}`;

/** Combines both sources; a gig in gigs.ts wins over the same date and venue from D1. */
export const mergeGigs = (local: Gig[], published: Gig[]): Gig[] => {
	const seen = new Set(local.map(gigKey));
	return [...local, ...published.filter((gig) => !seen.has(gigKey(gig)))];
};

type WranglerResult = { results?: PublicGigRow[]; success?: boolean };

export const parseWranglerOutput = (output: string): PublicGigRow[] => {
	// Wrangler can print notices before the JSON.
	const start = output.indexOf('[');
	if (start === -1) throw new Error('No JSON in wrangler output');
	const parsed = JSON.parse(output.slice(start)) as WranglerResult[];
	const [first] = parsed;
	if (!first?.success || !first.results) {
		throw new Error('The D1 query did not succeed');
	}
	return first.results;
};

/** Reads public gigs from the remote crew database through wrangler. */
export const fetchPublishedGigs = async (): Promise<Gig[]> => {
	const command = [
		'bunx',
		'wrangler',
		'd1',
		'execute',
		'scarletts-crew',
		'--remote',
		'--json',
		'--command',
		PUBLIC_GIGS_SQL,
	];
	const child = Bun.spawn(command, { stdout: 'pipe', stderr: 'inherit' });
	const [output, exitCode] = await Promise.all([
		new Response(child.stdout).text(),
		child.exited,
	]);
	if (exitCode !== 0) throw new Error(`wrangler exited with ${exitCode}`);
	return parseWranglerOutput(output).map(rowToGig);
};
