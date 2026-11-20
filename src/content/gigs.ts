type TicketStatus = 'on-sale' | 'sold-out';

type Ticket = {
	status: TicketStatus;
	href: string;
};

export type Gig = {
	date: string; // ISO date, e.g. "2026-11-14"
	venue: string;
	city: string;
	details?: string; // "Doors 8pm. £8 on the door."
	ticket?: Ticket;
	eventHref?: string,
};

export const gigs: Gig[] = [
	{
		date: '2026-11-28',
		venue: 'The Old Stillage',
		city: 'Bristol',
		details: 'Girls Are Loud Drum & Bass night',
		eventHref: 'https://www.instagram.com/reel/Dfu1hj_M7lB/?dmpr=NWJieWJ5cDQzYmV2',
	},
];

// Past gigs drop off at build time, so rebuild after each gig (or on a schedule).
export const upcomingGigs = (all: Gig[] = gigs, today = new Date()): Gig[] => {
	const todayIso = today.toISOString().slice(0, 10);
	return all
		.filter((gig) => gig.date >= todayIso)
		.sort((a, b) => a.date.localeCompare(b.date));
};

export const gigDateParts = (isoDate: string) => {
	const date = new Date(`${isoDate}T12:00:00Z`);
	const part = (options: Intl.DateTimeFormatOptions) =>
		new Intl.DateTimeFormat('en-GB', {
			...options,
			timeZone: 'Europe/London',
		}).format(date);
	return {
		weekday: part({ weekday: 'short' }),
		day: Number(part({ day: 'numeric' })),
		month: part({ month: 'short' }),
	};
};
