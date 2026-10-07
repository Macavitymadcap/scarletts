// Media lives in the R2 bucket behind media.scarletts.uk. With LOCAL_MEDIA
// set, the build copies media/out into dist/media and links to that instead,
// so prepared photos can be checked before uploading.
export const LOCAL_MEDIA = Boolean(process.env.LOCAL_MEDIA);

export const MEDIA_BASE_URL = LOCAL_MEDIA
	? '/media'
	: (process.env.MEDIA_BASE_URL ?? 'https://media.scarletts.uk').replace(
			/\/$/,
			'',
		);

export const media = (key: string): string =>
	`${MEDIA_BASE_URL}/${key.replace(/^\//, '')}`;
