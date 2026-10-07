import { GigCard } from '../components/GigCard';
import { Layout } from '../components/Layout';
import { Button, Checkerboard, Section, Sticker, Tape } from '../components/ui';
import { upcomingGigs } from '../content/gigs';
import { leadPhoto, photoUrl } from '../content/photos';
import { site } from '../site';

export const Home = () => {
	const lead = leadPhoto();
	const [nextGig] = upcomingGigs();

	return (
		<Layout current="/" ogImage={lead && photoUrl(lead)}>
			<header class="hero">
				<div class="hero__block">
					<p class="hero__kicker">Ska / Bristol</p>
					<h1 class="hero__name">{site.name}</h1>
					<p class="hero__pitch">{site.pitch}</p>
					<div class="hero__actions">
						<Button variant="secondary" href="/bio">
							Read the bio
						</Button>
						<Button variant="secondary" href="/photos">
							See the photos
						</Button>
					</div>
				</div>
				<div class={lead ? 'hero__photo' : 'hero__photo hero__photo--empty'}>
					{lead && (
						<img
							src={photoUrl(lead, 'small')}
							srcset={`${photoUrl(lead, 'small')} 800w, ${photoUrl(lead)} 1600w`}
							sizes="(min-width: 800px) 58vw, 100vw"
							alt={lead.alt}
							width={lead.width}
							height={lead.height}
						/>
					)}
					<Sticker>Dance!</Sticker>
				</div>
			</header>
			<Checkerboard />
			<Section
				id="next-gig"
				title="Next gig"
				aside={
					nextGig ? undefined : (
						<Tape tone="scarlet" tilt="right">
							Coming soon
						</Tape>
					)
				}
			>
				{nextGig ? (
					<GigCard gig={nextGig} />
				) : (
					<p class="prose">
						No dates announced yet. Want us at your night?{' '}
						<a href={`mailto:${site.bookingsEmail}`}>Get in touch</a>.
					</p>
				)}
			</Section>
		</Layout>
	);
};
