import type { Temporal } from 'temporal-polyfill';
import { type GridDay, monthGrid, monthLabel } from '../dates';
import type { CrewEvent, Member, Unavailability } from '../db';
import { CrewLayout } from './layout';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export type MonthPageProps = {
	member: Member;
	month: Temporal.PlainYearMonth;
	today: string;
	events: CrewEvent[];
	unavailable: Unavailability[];
};

const EventLink = ({ event }: { event: CrewEvent }) => (
	<a
		class={`crew-event crew-event--${event.kind}`}
		href={`/crew/events/${event.id}`}
	>
		{event.startTime && <span class="crew-event__time">{event.startTime}</span>}{' '}
		{event.title}
		{event.isPublic && <span class="crew-event__public"> (on site)</span>}
	</a>
);

type DayProps = {
	day: GridDay;
	weekday: string;
	today: string;
	month: Temporal.PlainYearMonth;
	member: Member;
	events: CrewEvent[];
	unavailable: Unavailability[];
};

const Day = ({
	day,
	weekday,
	today,
	month,
	member,
	events,
	unavailable,
}: DayProps) => {
	const imOut = unavailable.some((entry) => entry.email === member.email);
	const classes = [
		'crew-day',
		!day.inMonth && 'crew-day--outside',
		day.date === today && 'crew-day--today',
		day.date < today && 'crew-day--past',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<li class={classes}>
			<p class="crew-day__date">
				<span class="crew-day__weekday">{weekday} </span>
				<time datetime={day.date}>{Number(day.date.slice(8))}</time>
			</p>
			{events.length > 0 && (
				<ul class="crew-day__events">
					{events.map((event) => (
						<li>
							<EventLink event={event} />
						</li>
					))}
				</ul>
			)}
			{unavailable.length > 0 && (
				<p class="crew-day__out">
					Out: {unavailable.map((entry) => entry.name).join(', ')}
				</p>
			)}
			<div class="crew-day__actions">
				<a href={`/crew/events/new?date=${day.date}`}>Add</a>
				<form method="post" action={`/crew/unavailable/${day.date}`}>
					<input type="hidden" name="month" value={month.toString()} />
					<button type="submit" aria-pressed={imOut ? 'true' : 'false'}>
						{imOut ? "I'm free" : "I'm out"}
					</button>
				</form>
			</div>
		</li>
	);
};

export const MonthPage = ({
	member,
	month,
	today,
	events,
	unavailable,
}: MonthPageProps) => {
	const label = monthLabel(month);
	const previous = month.subtract({ months: 1 });
	const next = month.add({ months: 1 });

	return (
		<CrewLayout title={label} member={member} current="calendar">
			<section class="crew-month" aria-labelledby="month-title">
				<div class="crew-month__head">
					<a href={`/crew?month=${previous.toString()}`} rel="prev">
						← {monthLabel(previous)}
					</a>
					<h1 class="crew-month__title" id="month-title">
						{label}
					</h1>
					<a href={`/crew?month=${next.toString()}`} rel="next">
						{monthLabel(next)} →
					</a>
				</div>
				<p class="crew-month__actions">
					<a class="sc-btn sc-btn--primary" href="/crew/events/new">
						Add event
					</a>
					<a class="sc-btn sc-btn--secondary" href="/crew">
						Today
					</a>
				</p>
				<div class="crew-weekdays" aria-hidden="true">
					{WEEKDAYS.map((weekday) => (
						<span>{weekday}</span>
					))}
				</div>
				<ol class="crew-grid">
					{monthGrid(month)
						.flat()
						.map((day, index) => (
							<Day
								day={day}
								weekday={WEEKDAYS[index % 7] ?? ''}
								today={today}
								month={month}
								member={member}
								events={events.filter((event) => event.date === day.date)}
								unavailable={unavailable.filter(
									(entry) => entry.date === day.date,
								)}
							/>
						))}
				</ol>
			</section>
		</CrewLayout>
	);
};
