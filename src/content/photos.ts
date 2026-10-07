import { media } from './media';

export type PhotoGroup = 'gigs' | 'band';

export type Photo = {
	// R2 key without size suffix or extension, e.g. "photos/gigs/thekla-01".
	// scripts/prepare-photos.ts writes "<key>.webp" (1600 px) and
	// "<key>-800.webp" (800 px), and prints these entries for you.
	key: string;
	group: PhotoGroup;
	alt: string;
	width: number; // of the 1600 px version
	height: number;
	credit?: string;
	lead?: boolean; // the home page hero photo
};

export const photos: Photo[] = [
	{
		key: 'photos/gigs/brighton-band-full',
		group: 'gigs',
		alt: 'Band on stage at Brighton Electric 2026-09-26',
		width: 1600,
		height: 900,
	},
	{
		key: 'photos/gigs/brighton-cini-arms-up',
		group: 'gigs',
		alt: 'Cini giving it her all on stage at Brighton Electric 2026-09-26',
		width: 1600,
		height: 2125,
	},
	{
		key: 'photos/gigs/chelsea-band-selfie',
		group: 'gigs',
		alt: 'Band selfie with crowd at The Chelsea 2026-09-18',
		width: 1600,
		height: 1200,
	},
	{
		key: 'photos/gigs/fernhill-band-selfie',
		group: 'gigs',
		alt: 'Band selfie with crowd at Fernhill Festival 2026-07-27',
		width: 1600,
		height: 901,
	},
	{
		key: 'photos/gigs/fernhill-post-gig',
		group: 'gigs',
		alt: 'Band letting their hair down after the gig at Fernhill festival 2026-07-27',
		width: 1600,
		height: 1205,
	},
	{
		key: 'photos/gigs/fernhill-pre-gig',
		group: 'gigs',
		alt: 'Band getting ready before the gig at Fernhill festival 2026-07-27',
		width: 1536,
		height: 2040,
	},
	{
		key: 'photos/gigs/fernhill-stage-left-mid',
		group: 'gigs',
		alt: 'Band in full swing at Fernhill festival 2026-07-27',
		width: 1600,
		height: 1200,
		lead: true,
	},
	{
		key: 'photos/gigs/staff-party-band-self',
		group: 'gigs',
		alt: 'Callum tries out saxophone at The Stag & Hounds 2026-09-19',
		width: 1600,
		height: 1200,
	},
	{
		key: 'photos/gigs/staff-party-callum-sax',
		group: 'gigs',
		alt: 'Band selfie with crowd at The Stag & Hounds 2026-09-19',
		width: 1536,
		height: 2048,
	},
];

export const photoUrl = (photo: Photo, size: 'full' | 'small' = 'full') =>
	media(size === 'full' ? `${photo.key}.webp` : `${photo.key}-800.webp`);

export const photosIn = (group: PhotoGroup) =>
	photos.filter((photo) => photo.group === group);

export const leadPhoto = (): Photo | undefined =>
	photos.find((photo) => photo.lead) ?? photos[0];
