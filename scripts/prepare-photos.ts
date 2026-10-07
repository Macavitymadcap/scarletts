// Prepares phone photos for the site.
//
//   media/originals/<group>/<name>.jpg   (group is "gigs" or "band")
//   -> media/out/photos/<group>/<name>.webp       1600 px wide
//   -> media/out/photos/<group>/<name>-800.webp   800 px wide
//
// Each photo is turned upright using its EXIF orientation, then all metadata
// (including GPS location) is dropped; sharp writes none unless asked to.
// Prints entries to paste into src/content/photos.ts.

import { mkdir, readdir } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const ORIGINALS = 'media/originals';
const OUT = 'media/out/photos';
const SIZES = [
	{ width: 1600, suffix: '' },
	{ width: 800, suffix: '-800' },
] as const;
const IMAGE = /\.(jpe?g|png|webp|tiff?)$/i;

const slug = (name: string) =>
	name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

const entries: string[] = [];

for (const group of await readdir(ORIGINALS)) {
	const files = (await readdir(join(ORIGINALS, group)))
		.filter((f) => IMAGE.test(f))
		.sort();
	await mkdir(join(OUT, group), { recursive: true });

	for (const file of files) {
		const name = slug(basename(file, extname(file)));
		const upright = await sharp(join(ORIGINALS, group, file))
			.rotate()
			.toBuffer();

		let full = { width: 0, height: 0 };
		for (const size of SIZES) {
			const info = await sharp(upright)
				.resize({ width: size.width, withoutEnlargement: true })
				.webp({ quality: 80 })
				.toFile(join(OUT, group, `${name}${size.suffix}.webp`));
			if (size.suffix === '') full = { width: info.width, height: info.height };
		}

		entries.push(
			`  { key: "photos/${group}/${name}", group: "${group}", alt: "TODO", width: ${full.width}, height: ${full.height} },`,
		);
		console.error(`prepared ${group}/${file}`);
	}
}

console.log(entries.join('\n'));
