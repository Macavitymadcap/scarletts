import { cp, mkdir, rm } from 'node:fs/promises';
import type { FC } from 'hono/jsx';
import { gigs } from './content/gigs';
import { LOCAL_MEDIA } from './content/media';
import { fetchPublishedGigs, mergeGigs } from './content/published-gigs';
import { Bio } from './pages/bio';
import { Home } from './pages/home';
import { NotFound } from './pages/not-found';
import { Photos } from './pages/photos';
import { type Route, site } from './site';

// Cloudflare serves dist/bio.html at /bio, so every page is a flat .html file.
const pages: Record<Route, FC> = {
	'/': Home,
	'/bio': Bio,
	'/photos': Photos,
};

export const fileFor = (route: Route): string =>
	route === '/' ? 'index.html' : `${route.slice(1)}.html`;

export const render = async (Page: FC): Promise<string> =>
	`<!doctype html>${await (<Page />).toString()}`;

const sitemap = (routes: Route[]) =>
	`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${site.url}${route}</loc></url>`).join('\n')}
</urlset>
`;

if (import.meta.main) {
	await rm('dist', { recursive: true, force: true });
	await mkdir('dist', { recursive: true });

	// Deploys set D1_GIGS so gigs published from the crew calendar reach the
	// home page. A failed fetch stops the deploy rather than dropping them.
	if (process.env.D1_GIGS === '1') {
		const published = await fetchPublishedGigs();
		const merged = mergeGigs(gigs, published);
		const added = merged.length - gigs.length;
		gigs.splice(0, gigs.length, ...merged);
		console.log(`Added ${added} gigs from the crew calendar`);
	}

	for (const [route, Page] of Object.entries(pages) as [Route, FC][]) {
		await Bun.write(`dist/${fileFor(route)}`, await render(Page));
	}
	await Bun.write('dist/404.html', await render(NotFound));
	await Bun.write('dist/sitemap.xml', sitemap(Object.keys(pages) as Route[]));

	await cp('public', 'dist', { recursive: true });
	await cp('src/styles', 'dist/styles', { recursive: true });
	await cp(
		'node_modules/htmx.org/dist/htmx.min.js',
		'dist/scripts/htmx.min.js',
	);

	if (LOCAL_MEDIA) {
		const hasMedia =
			(await Bun.file('media/out').exists()) ||
			(await Array.fromAsync(new Bun.Glob('**/*').scan('media/out'))).length >
				0;
		if (hasMedia) {
			await cp('media/out', 'dist/media', { recursive: true });
			console.log('Copied media/out into dist/media for local preview');
		} else {
			console.warn(
				'LOCAL_MEDIA is set but media/out is empty; run bun run photos:prepare first',
			);
		}
	}

	console.log(
		`Built ${Object.keys(pages).length} pages and a 404 page into dist/`,
	);
}
