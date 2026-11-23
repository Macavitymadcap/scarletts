import { describe, expect, test } from 'bun:test';
import type { Gig } from '../src/content/gigs';
import {
	mergeGigs,
	parseWranglerOutput,
	rowToGig,
} from '../src/content/published-gigs';

describe('rowToGig', () => {
	test('maps a D1 row to a gig with a ticket link', () => {
		// Act
		const gig = rowToGig({
			date: '2026-12-05',
			venue: 'Trinity Centre',
			city: 'Bristol',
			details: 'Doors 19:00',
			ticket_status: 'on-sale',
			ticket_href: 'https://tickets.example/1',
			event_href: null,
		});

		// Assert
		expect(gig).toEqual({
			date: '2026-12-05',
			venue: 'Trinity Centre',
			city: 'Bristol',
			details: 'Doors 19:00',
			ticket: { status: 'on-sale', href: 'https://tickets.example/1' },
		});
	});
});

describe('mergeGigs', () => {
	test('keeps the gigs.ts entry when both sources list a gig', () => {
		// Arrange
		const local: Gig[] = [
			{ date: '2026-12-05', venue: 'Trinity Centre', city: 'Bristol' },
		];
		const published: Gig[] = [
			{
				date: '2026-12-05',
				venue: 'trinity centre ',
				city: 'Bristol',
				details: 'dupe',
			},
			{ date: '2026-12-12', venue: 'The Fleece', city: 'Bristol' },
		];

		// Act
		const merged = mergeGigs(local, published);

		// Assert
		expect(merged.map((gig) => gig.venue)).toEqual([
			'Trinity Centre',
			'The Fleece',
		]);
	});
});

describe('parseWranglerOutput', () => {
	test('reads results after any notices wrangler prints', () => {
		// Arrange
		const output = `Executing on remote database\n${JSON.stringify([
			{ success: true, results: [{ date: '2026-12-05' }] },
		])}`;

		// Act
		const rows = parseWranglerOutput(output);

		// Assert
		expect(rows).toEqual([{ date: '2026-12-05' }] as never);
	});

	test('throws when the query failed', () => {
		// Act
		const parse = () => parseWranglerOutput('[{"success":false}]');

		// Assert
		expect(parse).toThrow();
	});
});
