import { type Gig, gigDateParts } from '../content/gigs';
import { Button, Tape } from './ui';

export const GigCard = ({ gig }: { gig: Gig }) => {
	const { weekday, day, month } = gigDateParts(gig.date);

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
					{gig.ticket?.status === 'on-sale' ? (
						<Button href={gig.ticket.href}>Get tickets</Button>
					) : gig.ticket?.status ==='sold-out' ? (
						<Tape tone="ink" tilt="left">
							Sold out
						</Tape>
					) : gig.eventHref ? (
						<Button href={gig.eventHref}>Event page</Button>
					) : null }
				</div>
			</div>
		</article>
	);
};
