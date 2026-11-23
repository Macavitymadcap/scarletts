import { Temporal } from 'temporal-polyfill';
import { addDays } from './dates';
import type { CrewEvent } from './db';

// Times are entered as UK wall-clock times, so the feed carries the rules
// for Europe/London rather than converting to UTC.
const LONDON_TIMEZONE = [
	'BEGIN:VTIMEZONE',
	'TZID:Europe/London',
	'BEGIN:DAYLIGHT',
	'TZOFFSETFROM:+0000',
	'TZOFFSETTO:+0100',
	'TZNAME:BST',
	'DTSTART:19700329T010000',
	'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
	'END:DAYLIGHT',
	'BEGIN:STANDARD',
	'TZOFFSETFROM:+0100',
	'TZOFFSETTO:+0000',
	'TZNAME:GMT',
	'DTSTART:19701025T020000',
	'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
	'END:STANDARD',
	'END:VTIMEZONE',
];

const encoder = new TextEncoder();

export const escapeText = (value: string): string =>
	value
		.replace(/\\/g, '\\\\')
		.replace(/;/g, '\\;')
		.replace(/,/g, '\\,')
		.replace(/\r?\n/g, '\\n');

/** Splits lines longer than 75 octets, as RFC 5545 requires. */
export const foldLine = (line: string): string => {
	const parts: string[] = [];
	let current = '';
	let octets = 0;
	for (const char of line) {
		const size = encoder.encode(char).length;
		const limit = parts.length === 0 ? 75 : 74; // continuation lines start with a space
		if (octets + size > limit) {
			parts.push(current);
			current = '';
			octets = 0;
		}
		current += char;
		octets += size;
	}
	parts.push(current);
	return parts.join('\r\n ');
};

const compactDate = (iso: string): string => iso.replace(/-/g, '');
const compactTime = (time: string): string => `${time.replace(':', '')}00`;
const stamp = (instant: string): string =>
	Temporal.Instant.from(instant)
		.round({ smallestUnit: 'second', roundingMode: 'trunc' })
		.toString()
		.replace(/[-:]/g, '');

const timing = (event: CrewEvent): string[] => {
	if (!event.startTime) {
		return [
			`DTSTART;VALUE=DATE:${compactDate(event.date)}`,
			`DTEND;VALUE=DATE:${compactDate(addDays(event.date, 1))}`,
		];
	}
	const start = `DTSTART;TZID=Europe/London:${compactDate(event.date)}T${compactTime(event.startTime)}`;
	if (!event.endTime) return [start];
	// An end time before the start means the event runs past midnight.
	const endDate =
		event.endTime <= event.startTime ? addDays(event.date, 1) : event.date;
	return [
		start,
		`DTEND;TZID=Europe/London:${compactDate(endDate)}T${compactTime(event.endTime)}`,
	];
};

const description = (event: CrewEvent): string =>
	[
		event.details,
		event.ticketHref && `Tickets: ${event.ticketHref}`,
		event.eventHref && `Event: ${event.eventHref}`,
		`Last edited by ${event.updatedBy}`,
	]
		.filter(Boolean)
		.join('\n');

const vevent = (event: CrewEvent, host: string): string[] => {
	const location = [event.venue, event.city].filter(Boolean).join(', ');
	return [
		'BEGIN:VEVENT',
		`UID:event-${event.id}@${host}`,
		`DTSTAMP:${stamp(event.updatedAt)}`,
		`LAST-MODIFIED:${stamp(event.updatedAt)}`,
		...timing(event),
		`SUMMARY:${escapeText(event.title)}`,
		...(location ? [`LOCATION:${escapeText(location)}`] : []),
		`DESCRIPTION:${escapeText(description(event))}`,
		`CATEGORIES:${event.kind.toUpperCase()}`,
		'END:VEVENT',
	];
};

/** Renders events as an iCalendar feed that phone calendar apps can subscribe to. */
export const toIcs = (events: CrewEvent[], host: string): string =>
	[
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		`PRODID:-//Scarletts//Crew calendar//EN`,
		'CALSCALE:GREGORIAN',
		'METHOD:PUBLISH',
		'X-WR-CALNAME:Scarletts',
		'X-WR-TIMEZONE:Europe/London',
		'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
		...LONDON_TIMEZONE,
		...events.flatMap((event) => vevent(event, host)),
		'END:VCALENDAR',
	]
		.map(foldLine)
		.join('\r\n')
		.concat('\r\n');
