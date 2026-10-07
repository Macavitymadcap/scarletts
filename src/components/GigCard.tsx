import { type Gig, gigDateParts } from '../content/gigs';
import { Button, Tape } from './ui';

export const GigCard = ({ gig }: { gig: Gig }) => {
	const { weekday, day, month } = gigDateParts(gig.date);
	const status = gig.status ?? 'on-sale';

	return (
		<article class="sc-gig">
			<time class="sc-gig__date" datetime={gig.date}>
				<span class="sc-gig__weekday">{weekday}</span>
				<span class="sc-gig__day">{day}</span>
				<span class="sc-gig__month">{month}</span>
			</time>
			<div class="sc-gig__body">
				<h3 class="sc-gig__venue">{gig.venue}</h3>
				<p class="sc-gig__city">{gig.city}</p>
				{gig.details && <p class="sc-gig__details">{gig.details}</p>}
				<div class="sc-gig__action">
					{status === 'sold-out' ? (
						<Tape tone="ink" tilt="left">
							Sold out
						</Tape>
					) : status === 'free' ? (
						<Tape tone="scarlet" tilt="right">
							Free entry
						</Tape>
					) : gig.ticketsHref ? (
						<Button href={gig.ticketsHref}>Get tickets</Button>
					) : null}
				</div>
			</div>
		</article>
	);
};
