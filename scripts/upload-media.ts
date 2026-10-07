// Uploads everything in media/out to the R2 bucket with Wrangler.
// Run "bunx wrangler login" once first. Existing objects are overwritten.

import { readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { $ } from 'bun';

const BUCKET = 'scarletts-media';
const ROOT = 'media/out';

const CONTENT_TYPES: Record<string, string> = {
	'.webp': 'image/webp',
	'.jpg': 'image/jpeg',
	'.mp3': 'audio/mpeg',
	'.mp4': 'video/mp4',
};

const files = (await readdir(ROOT, { recursive: true }))
	.map((path) => join(ROOT, path))
	.filter((path) => extname(path) in CONTENT_TYPES);

for (const path of files) {
	const key = relative(ROOT, path).split('\\').join('/');
	const contentType = CONTENT_TYPES[extname(path)];
	// --remote targets the real bucket rather than Wrangler's local simulation.
	await $`bunx wrangler r2 object put ${`${BUCKET}/${key}`} --file ${path} --content-type ${contentType} --cache-control ${'public, max-age=604800'} --remote`;
}

console.log(`Uploaded ${files.length} files to ${BUCKET}`);
