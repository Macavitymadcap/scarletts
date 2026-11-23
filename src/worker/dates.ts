import { Temporal } from 'temporal-polyfill';

/** Calendar helpers. Dates cross the database and URLs as ISO strings; only
 * "today" depends on the band's time zone. */

export type GridDay = { date: string; inMonth: boolean };

const ZONE = 'Europe/London';
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_MONTH = /^\d{4}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export const isIsoDate = (value: string): boolean => {
	if (!ISO_DATE.test(value)) return false;
	try {
		Temporal.PlainDate.from(value, { overflow: 'reject' });
		return true;
	} catch {
		return false;
	}
};

export const isTime = (value: string): boolean => TIME.test(value);

export const londonToday = (
	now: Temporal.Instant = Temporal.Now.instant(),
): string => now.toZonedDateTimeISO(ZONE).toPlainDate().toString();

export const addDays = (iso: string, days: number): string =>
	Temporal.PlainDate.from(iso).add({ days }).toString();

/** Reads a YYYY-MM month, falling back to the month containing `today`. */
export const parseMonth = (
	value: string | undefined,
	today: string,
): Temporal.PlainYearMonth => {
	if (value && ISO_MONTH.test(value)) {
		try {
			return Temporal.PlainYearMonth.from(value, { overflow: 'reject' });
		} catch {
			// Falls through to the current month.
		}
	}
	return Temporal.PlainDate.from(today).toPlainYearMonth();
};

export const monthLabel = (month: Temporal.PlainYearMonth): string =>
	month.toPlainDate({ day: 1 }).toLocaleString('en-GB', {
		month: 'long',
		year: 'numeric',
	});

/** Whole weeks, Monday first, covering every day of the month. */
export const monthGrid = (month: Temporal.PlainYearMonth): GridDay[][] => {
	const first = month.toPlainDate({ day: 1 });
	const weeks: GridDay[][] = [];
	let date = first.subtract({ days: first.dayOfWeek - 1 });

	do {
		const week: GridDay[] = [];
		for (let day = 0; day < 7; day++) {
			week.push({
				date: date.toString(),
				inMonth: date.toPlainYearMonth().equals(month),
			});
			date = date.add({ days: 1 });
		}
		weeks.push(week);
	} while (date.toPlainYearMonth().equals(month));

	return weeks;
};

export const dayLabel = (iso: string): string =>
	Temporal.PlainDate.from(iso).toLocaleString('en-GB', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});
