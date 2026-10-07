import { media } from "./media";

export type PhotoGroup = "gigs" | "band";

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

export const photos: Photo[] = [];

export const photoUrl = (photo: Photo, size: "full" | "small" = "full") =>
	media(size === "full" ? `${photo.key}.webp` : `${photo.key}-800.webp`);

export const photosIn = (group: PhotoGroup) =>
	photos.filter((photo) => photo.group === group);

export const leadPhoto = (): Photo | undefined =>
	photos.find((photo) => photo.lead) ?? photos[0];
