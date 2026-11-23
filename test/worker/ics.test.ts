import { describe, expect, test } from 'bun:test';
import type { CrewEvent } from '../../src/worker/db';
import { escapeText, foldLine, toIcs } from '../../src/worker/ics';

const event = (overrides: Partial<CrewEvent> = {}): CrewEvent => ({
	id: 7,
	date: '2026-12-05',
	startTime: null,
	endTime: null,
	title: 'Rehearsal',
	kind: 'rehearsal',
	venue: null,
	city: null,
	details: null,
	ticketStatus: null,
	ticketHref: null,
	eventHref: null,
	isPublic: false,
	updatedBy: 'Dan',
	updatedAt: '2026-11-20T10:15:00.000Z',
	...overrides,
});

describe('toIcs', () => {
	test('writes an all-day event as a one-day date range', () => {
		// Act
		const ics = toIcs([event()], 'scarletts.uk');

		// Assert
		expect(ics).toContain('DTSTART;VALUE=DATE:20261205\r\n');
		expect(ics).toContain('DTEND;VALUE=DATE:20261206\r\n');
		expect(ics).toContain('UID:event-7@scarletts.uk\r\n');
		expect(ics).toContain('DTSTAMP:20261120T101500Z\r\n');
	});

	test('writes timed events in UK time', () => {
		// Act
		const ics = toIcs(
			[event({ startTime: '19:30', endTime: '23:00' })],
			'scarletts.uk',
		);

		// Assert
		expect(ics).toContain('DTSTART;TZID=Europe/London:20261205T193000');
		expect(ics).toContain('DTEND;TZID=Europe/London:20261205T230000');
		expect(ics).toContain('BEGIN:VTIMEZONE');
	});

	test('ends a gig that runs past midnight on the next day', () => {
		// Act
		const ics = toIcs(
			[event({ startTime: '21:00', endTime: '01:00' })],
			'scarletts.uk',
		);

		// Assert
		expect(ics).toContain('DTEND;TZID=Europe/London:20261206T010000');
	});

	test('separates lines with CRLF and wraps the calendar', () => {
		// Act
		const ics = toIcs([], 'scarletts.uk');

		// Assert
		expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
		expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
	});
});

describe('escapeText', () => {
	test('escapes the characters iCalendar reserves', () => {
		// Act
		const escaped = escapeText('Doors 8pm; £8, cash\nNo re-entry');

		// Assert
		expect(escaped).toBe('Doors 8pm\\; £8\\, cash\\nNo re-entry');
	});
});

describe('foldLine', () => {
	test('keeps every folded line within 75 octets', () => {
		// Arrange
		const line = `SUMMARY:${'£'.repeat(100)}`;

		// Act
		const lines = foldLine(line).split('\r\n');

		// Assert
		expect(lines.length).toBeGreaterThan(1);
		for (const folded of lines) {
			expect(new TextEncoder().encode(folded).length).toBeLessThanOrEqual(75);
		}
		expect(
			lines.map((part, i) => (i === 0 ? part : part.slice(1))).join(''),
		).toBe(line);
	});
});
