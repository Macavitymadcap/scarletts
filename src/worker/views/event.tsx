import { Temporal } from 'temporal-polyfill';
import { dayLabel } from '../dates';
import type { CrewEvent, Member } from '../db';
import type { FormValues } from '../event-form';
import { CrewLayout, ErrorList } from './layout';

export type EventPageProps = {
	member: Member;
	values: FormValues;
	errors?: string[];
	/** Present when editing an existing event. */
	event?: CrewEvent;
};

type FieldProps = {
	name: string;
	label: string;
	values: FormValues;
	type?: string;
	required?: boolean;
	hint?: string;
};

const Field = ({
	name,
	label,
	values,
	type = 'text',
	required,
	hint,
}: FieldProps) => (
	<p class="crew-field">
		<label for={name}>{label}</label>
		<input
			id={name}
			name={name}
			type={type}
			value={values[name] ?? ''}
			required={required}
			aria-describedby={hint ? `${name}-hint` : undefined}
		/>
		{hint && (
			<span class="crew-field__hint" id={`${name}-hint`}>
				{hint}
			</span>
		)}
	</p>
);

const Select = ({
	name,
	label,
	values,
	options,
}: {
	name: string;
	label: string;
	values: FormValues;
	options: [value: string, label: string][];
}) => (
	<p class="crew-field">
		<label for={name}>{label}</label>
		<select id={name} name={name}>
			{options.map(([value, text]) => (
				<option value={value} selected={values[name] === value}>
					{text}
				</option>
			))}
		</select>
	</p>
);

const lastEdited = (event: CrewEvent): string => {
	const when = Temporal.Instant.from(event.updatedAt)
		.toZonedDateTimeISO('Europe/London')
		.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
	return `Last edited by ${event.updatedBy}, ${when}.`;
};

export const EventPage = ({
	member,
	values,
	errors = [],
	event,
}: EventPageProps) => {
	const action = event ? `/crew/events/${event.id}` : '/crew/events';
	const heading = event ? event.title : 'New event';

	return (
		<CrewLayout title={heading} member={member} current="calendar">
			<section class="crew-form" aria-labelledby="event-title">
				<p class="crew-form__back">
					<a href={`/crew?month=${(values.date ?? '').slice(0, 7)}`}>
						← Back to the calendar
					</a>
				</p>
				<h1 class="crew-form__title" id="event-title">
					{heading}
				</h1>
				{event && (
					<p class="crew-form__meta">
						{dayLabel(event.date)}. {lastEdited(event)}
					</p>
				)}
				<ErrorList errors={errors} />
				<form method="post" action={action}>
					<fieldset>
						<legend>What and when</legend>
						<Field name="title" label="Title" values={values} required />
						<Select
							name="kind"
							label="Kind"
							values={values}
							options={[
								['gig', 'Gig'],
								['rehearsal', 'Rehearsal'],
								['other', 'Other'],
							]}
						/>
						<Field
							name="date"
							label="Date"
							type="date"
							values={values}
							required
						/>
						<Field
							name="startTime"
							label="Start time"
							type="time"
							values={values}
							hint="Leave empty for an all-day event."
						/>
						<Field
							name="endTime"
							label="End time"
							type="time"
							values={values}
							hint="An end time before the start means it finishes after midnight."
						/>
					</fieldset>
					<fieldset>
						<legend>Where and details</legend>
						<Field name="venue" label="Venue" values={values} />
						<Field name="city" label="City" values={values} />
						<p class="crew-field">
							<label for="details">Details</label>
							<textarea id="details" name="details" rows={3}>
								{values.details ?? ''}
							</textarea>
						</p>
					</fieldset>
					<fieldset>
						<legend>Public site</legend>
						<Select
							name="ticketStatus"
							label="Tickets"
							values={values}
							options={[
								['', 'No tickets'],
								['on-sale', 'On sale'],
								['sold-out', 'Sold out'],
							]}
						/>
						<Field
							name="ticketHref"
							label="Ticket link"
							type="url"
							values={values}
						/>
						<Field
							name="eventHref"
							label="Event page link"
							type="url"
							values={values}
						/>
						<p class="crew-field crew-field--check">
							<input
								id="isPublic"
								name="isPublic"
								type="checkbox"
								checked={values.isPublic === 'on'}
							/>
							<label for="isPublic">
								Show this gig on scarletts.uk (after the next publish)
							</label>
						</p>
					</fieldset>
					<p class="crew-form__actions">
						<button class="sc-btn sc-btn--primary" type="submit">
							Save
						</button>
					</p>
				</form>
				{event && (
					<form
						class="crew-form__delete"
						method="post"
						action={`/crew/events/${event.id}/delete`}
						hx-confirm={`Delete "${event.title}"?`}
					>
						<button class="sc-btn sc-btn--secondary" type="submit">
							Delete event
						</button>
					</form>
				)}
			</section>
		</CrewLayout>
	);
};
