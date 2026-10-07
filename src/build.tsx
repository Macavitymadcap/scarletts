import { cp, mkdir, rm } from "node:fs/promises";
import type { FC } from "hono/jsx";
import { Bio } from "./pages/bio";
import { Home } from "./pages/home";
import { NotFound } from "./pages/not-found";
import { Photos } from "./pages/photos";
import { type Route, site } from "./site";

// Cloudflare serves dist/bio.html at /bio, so every page is a flat .html file.
const pages: Record<Route, FC> = {
	"/": Home,
	"/bio": Bio,
	"/photos": Photos,
};

export const fileFor = (route: Route): string =>
	route === "/" ? "index.html" : `${route.slice(1)}.html`;

export const render = async (Page: FC): Promise<string> =>
	`<!doctype html>${await (<Page />).toString()}`;

const sitemap = (routes: Route[]) =>
	`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${site.url}${route}</loc></url>`).join("\n")}
</urlset>
`;

if (import.meta.main) {
	await rm("dist", { recursive: true, force: true });
	await mkdir("dist", { recursive: true });

	for (const [route, Page] of Object.entries(pages) as [Route, FC][]) {
		await Bun.write(`dist/${fileFor(route)}`, await render(Page));
	}
	await Bun.write("dist/404.html", await render(NotFound));
	await Bun.write("dist/sitemap.xml", sitemap(Object.keys(pages) as Route[]));

	await cp("public", "dist", { recursive: true });
	await cp("src/styles", "dist/styles", { recursive: true });

	console.log(
		`Built ${Object.keys(pages).length} pages and a 404 page into dist/`,
	);
}
