import { describe, expect, test } from 'bun:test';
import { type Gig, gigDateParts, upcomingGigs } from '../src/content/gigs';

describe('upcomingGigs', () => {
	test('drops past gigs and sorts the rest by date', () => {
		// Arrange
		const gigs: Gig[] = [
			{ date: '2026-12-05', venue: 'Later', city: 'Bristol' },
			{ date: '2026-09-01', venue: 'Past', city: 'Bristol' },
			{ date: '2026-11-14', venue: 'Sooner', city: 'Bristol' },
		];
		const today = new Date('2026-10-07T10:00:00Z');

		// Act
		const result = upcomingGigs(gigs, today);

		// Assert
		expect(result.map((gig) => gig.venue)).toEqual(['Sooner', 'Later']);
	});

	test('keeps a gig on the day it happens', () => {
		// Arrange
		const gigs: Gig[] = [
			{ date: '2026-10-07', venue: 'Tonight', city: 'Bristol' },
		];
		const today = new Date('2026-10-07T21:00:00Z');

		// Act
		const result = upcomingGigs(gigs, today);

		// Assert
		expect(result).toHaveLength(1);
	});
});

describe('gigDateParts', () => {
	test('splits an ISO date into the parts the date stamp shows', () => {
		// Arrange
		const isoDate = '2026-11-14';

		// Act
		const parts = gigDateParts(isoDate);

		// Assert
		expect(parts).toEqual({ weekday: 'Sat', day: 14, month: 'Nov' });
	});
});
