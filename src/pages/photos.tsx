import { Layout } from '../components/Layout';
import { PhotoGrid } from '../components/Photo';
import {
	Checkerboard,
	Masthead,
	Section,
	Sticker,
	Tape,
} from '../components/ui';
import { photosIn } from '../content/photos';

const count = (n: number) => `${n} photo${n === 1 ? '' : 's'}`;

export const Photos = () => {
	const gigPhotos = photosIn('gigs');
	const bandPhotos = photosIn('band');
	const hasPhotos = gigPhotos.length + bandPhotos.length > 0;

	return (
		<Layout title="Photos" current="/photos">
			<Masthead
				kicker="Photos / Bristol"
				title="Photos"
				intro={
					hasPhotos
						? 'On stage and off. Tap any photo to see it full size.'
						: undefined
				}
				sticker={<Sticker tone="scarlet">Snap!</Sticker>}
			/>
			{!hasPhotos && (
				<Section
					id="soon"
					title="Coming soon"
					aside={<Tape tilt="right">Watch this space</Tape>}
				>
					<p class="prose">
						We're sorting through the camera rolls. Check back soon.
					</p>
				</Section>
			)}
			{gigPhotos.length > 0 && (
				<Section
					id="gigs"
					title="Gigs"
					aside={<p class="section__meta">{count(gigPhotos.length)}</p>}
				>
					<PhotoGrid photos={gigPhotos} />
				</Section>
			)}
			{gigPhotos.length > 0 && bandPhotos.length > 0 && <Checkerboard />}
			{bandPhotos.length > 0 && (
				<Section
					id="band"
					title="The band"
					aside={<Tape tilt="right">Off stage</Tape>}
				>
					<PhotoGrid photos={bandPhotos} feature={false} />
				</Section>
			)}
		</Layout>
	);
};
