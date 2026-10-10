import { Layout } from '../components/Layout';
import { LineUp } from '../components/LineUp';
import { Photo } from '../components/Photo';
import { Reviews } from '../components/Reviews';
import {
	Button,
	Checkerboard,
	Masthead,
	Section,
	Tape,
} from '../components/ui';
import { bio } from '../content/bio';
import { photosIn } from '../content/photos';
import { site } from '../site';

export const Bio = () => {
	const [bandPhoto] = photosIn('band');

	return (
		<Layout title="Bio" current="/bio">
			<Masthead
				kicker="Bio / Bristol"
				title={
					<>
						Who are <mark>{site.name}</mark>?
					</>
				}
			/>
			<section class="story">
				<div class="story__text">
					<p class="lede">{bio.lede}</p>
					{bio.paragraphs.map((paragraph) => (
						<p>{paragraph}</p>
					))}
					<div class="cta">
						<Button href={`mailto:${site.bookingsEmail}`}>Book the band</Button>
						<Button variant="secondary" href="/photos">
							See the photos
						</Button>
					</div>
				</div>
				{bandPhoto && <Photo photo={bandPhoto} />}
			</section>

			{bio.reviews.length > 0 && (
				<Section
					id="reviews"
					title="What people say"
					aside={<Tape tilt="right">Word on the street</Tape>}
				>
					<Reviews reviews={bio.reviews} />
				</Section>
			)}
			<Checkerboard />
			<Section id="line-up" title="The line-up">
				<LineUp members={bio.members} />
			</Section>
			<Section
				id="influences"
				title="Influences"
				aside={<Tape tilt="left">Turn it up</Tape>}
			>
				<ul class="influences">
					{bio.influences.map((influence) => (
						<li>{influence}</li>
					))}
				</ul>
			</Section>
		</Layout>
	);
};
