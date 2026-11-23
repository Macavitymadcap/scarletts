import { isIsoDate, isTime } from './dates';
import { type EventInput, eventKinds, ticketStatuses } from './db';

export type FormValues = Record<string, string>;

export type ParseResult =
	| { ok: true; value: EventInput }
	| { ok: false; errors: string[] };

const MAX_TEXT = 500;

const optional = (value: string | undefined): string | null => {
	const trimmed = value?.trim() ?? '';
	return trimmed === '' ? null : trimmed;
};

const isWebLink = (value: string): boolean => {
	try {
		const url = new URL(value);
		return url.protocol === 'https:' || url.protocol === 'http:';
	} catch {
		return false;
	}
};

const includes = <T extends string>(
	list: readonly T[],
	value: string | null,
): value is T => list.includes(value as T);

/** Turns a submitted event form into an event, or the reasons it can't be one. */
export const parseEventForm = (form: FormValues): ParseResult => {
	const errors: string[] = [];
	const date = form.date?.trim() ?? '';
	const title = optional(form.title);
	const kind = optional(form.kind) ?? 'other';
	const startTime = optional(form.startTime);
	const endTime = optional(form.endTime);
	const ticketStatus = optional(form.ticketStatus);
	const ticketHref = optional(form.ticketHref);
	const eventHref = optional(form.eventHref);
	const venue = optional(form.venue);
	const city = optional(form.city);
	const details = optional(form.details);
	const isPublic = form.isPublic === 'on';

	if (!isIsoDate(date)) errors.push('Pick a date.');
	if (!title) errors.push('Give the event a title.');
	if (!includes(eventKinds, kind)) errors.push('Pick a kind of event.');
	if (startTime && !isTime(startTime)) errors.push('Start time looks wrong.');
	if (endTime && !isTime(endTime)) errors.push('End time looks wrong.');
	if (endTime && !startTime)
		errors.push('Add a start time to go with the end time.');
	if (ticketStatus && !includes(ticketStatuses, ticketStatus)) {
		errors.push('Pick a ticket status.');
	}
	if (ticketStatus && !ticketHref) errors.push('Add the ticket link.');
	if (ticketHref && !isWebLink(ticketHref)) {
		errors.push('The ticket link must start with https://.');
	}
	if (eventHref && !isWebLink(eventHref)) {
		errors.push('The event link must start with https://.');
	}
	if (isPublic && kind !== 'gig') {
		errors.push('Only gigs can go on the public site.');
	}
	if (isPublic && (!venue || !city)) {
		errors.push('A gig on the public site needs a venue and a city.');
	}
	const tooLong = [title, venue, city, details].some(
		(value) => (value?.length ?? 0) > MAX_TEXT,
	);
	if (tooLong) errors.push(`Keep each field under ${MAX_TEXT} characters.`);

	if (
		errors.length > 0 ||
		!title ||
		!includes(eventKinds, kind) ||
		(ticketStatus !== null && !includes(ticketStatuses, ticketStatus))
	) {
		return { ok: false, errors };
	}

	return {
		ok: true,
		value: {
			date,
			startTime,
			endTime,
			title,
			kind,
			venue,
			city,
			details,
			ticketStatus,
			ticketHref,
			eventHref,
			isPublic,
		},
	};
};

/** The form's starting values for an existing event or a new one on a date. */
export const formValuesFor = (event: EventInput): FormValues => ({
	date: event.date,
	startTime: event.startTime ?? '',
	endTime: event.endTime ?? '',
	title: event.title,
	kind: event.kind,
	venue: event.venue ?? '',
	city: event.city ?? '',
	details: event.details ?? '',
	ticketStatus: event.ticketStatus ?? '',
	ticketHref: event.ticketHref ?? '',
	eventHref: event.eventHref ?? '',
	isPublic: event.isPublic ? 'on' : '',
});
