import { describe, expect, test } from 'bun:test';
import { Temporal } from 'temporal-polyfill';
import {
	dayLabel,
	isIsoDate,
	londonToday,
	monthGrid,
	monthLabel,
	parseMonth,
} from '../../src/worker/dates';

const month = (value: string) => Temporal.PlainYearMonth.from(value);

describe('monthGrid', () => {
	test('covers the month in whole weeks starting on Monday', () => {
		// Act
		const weeks = monthGrid(month('2026-12'));

		// Assert
		expect(weeks).toHaveLength(5);
		expect(weeks[0]?.[0]).toEqual({ date: '2026-11-30', inMonth: false });
		expect(weeks[0]?.[1]).toEqual({ date: '2026-12-01', inMonth: true });
		expect(weeks.at(-1)?.at(-1)).toEqual({
			date: '2027-01-03',
			inMonth: false,
		});
	});

	test('adds no extra week when the month ends on a Sunday', () => {
		// Act
		const weeks = monthGrid(month('2026-05'));

		// Assert
		expect(weeks.at(-1)?.at(-1)?.date).toBe('2026-05-31');
	});
});

describe('parseMonth', () => {
	test('reads a YYYY-MM month', () => {
		// Act
		const parsed = parseMonth('2027-02', '2026-11-23');

		// Assert
		expect(parsed.toString()).toBe('2027-02');
	});

	test('falls back to the current month for nonsense', () => {
		// Act
		const parsed = parseMonth('2026-13', '2026-11-23');

		// Assert
		expect(parsed.toString()).toBe('2026-11');
	});
});

describe('labels', () => {
	test('names months and days in British English', () => {
		// Act
		const labels = [monthLabel(month('2026-12')), dayLabel('2026-12-05')];

		// Assert
		expect(labels).toEqual(['December 2026', 'Saturday, 5 December 2026']);
	});
});

describe('londonToday', () => {
	test('uses UK time, which is ahead of UTC in summer', () => {
		// Act
		const today = londonToday(Temporal.Instant.from('2026-07-01T23:30:00Z'));

		// Assert
		expect(today).toBe('2026-07-02');
	});
});

describe('isIsoDate', () => {
	test('rejects dates that do not exist', () => {
		// Act
		const results = ['2026-02-29', '2028-02-29', '2026-1-01'].map(isIsoDate);

		// Assert
		expect(results).toEqual([false, true, false]);
	});
});
