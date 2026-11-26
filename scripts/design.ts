// The design system in design/ is the source of truth for the site's look.
// These helpers build its component bundle and check that the site's copies
// of its CSS still match; `bun run design:build` and test/design.test.ts use
// them.

import { createHash } from 'node:crypto';

export const DESIGN_SOURCE = 'design/components/src/index.tsx';
export const DESIGN_BUNDLE = 'design/components/bundle.js';
export const DESIGN_CSS = 'design/components/bundle.css';
export const DESIGN_TOKENS = 'design/tokens.css';
export const SITE_CSS = 'src/styles/components.css';
export const SITE_TOKENS = 'src/styles/tokens.css';

export const SITE_CSS_HEADER = `/* Scarletts components, copied from design/components/bundle.css by
   \`bun run design:build\`; edit them there, not here. Every value comes from
   tokens.css. The track list styles are ready for the music page. */

`;

const HASH_PREFIX = '/* @ds-source-sha256: ';

export const sourceHash = (source: string): string =>
	createHash('sha256').update(source).digest('hex');

// The names registered on window.Scarletts, in the order the source lists them.
export const componentNames = (source: string): string[] => {
	const match = source.match(/const Scarletts = \{([^}]*)\}/);
	if (!match) throw new Error('No `const Scarletts = { ... }` in source');
	return (match[1] ?? '')
		.split(',')
		.map((name) => name.trim())
		.filter(Boolean);
};

export const bundleHeader = (names: string[], hash: string): string =>
	`/* @ds-bundle: ${JSON.stringify({
		format: 4,
		namespace: 'Scarletts',
		components: names.map((name) => ({ name })),
	})} */\n${HASH_PREFIX}${hash} */\n`;

export const bundleSourceHash = (bundle: string): string | undefined => {
	const line = bundle.split('\n').find((l) => l.startsWith(HASH_PREFIX));
	return line?.slice(HASH_PREFIX.length).replace(/ \*\/$/, '');
};

// Everything from the first shared rule on: the design's bundle.css adds a
// font import and a body rule for its previews, and the site adds a header.
export const cssBody = (css: string): string => {
	const start = css.indexOf(':where(');
	if (start === -1) throw new Error('No `:where(` rule to start from');
	return css.slice(start);
};

export type ThemeProperties = {
	light: Record<string, string>;
	dark: Record<string, string>;
	darkBySystem: Record<string, string>;
};

// Custom properties per theme. Night is set twice: once for data-theme="dark"
// and once inside the prefers-color-scheme query.
export const themeProperties = (css: string): ThemeProperties => {
	const themes: ThemeProperties = { light: {}, dark: {}, darkBySystem: {} };
	for (const [, selector = '', body = ''] of css.matchAll(
		/([^{}]+)\{([^{}]*)\}/g,
	)) {
		const theme = selector.includes(':not([data-theme="light"])')
			? 'darkBySystem'
			: selector.includes('data-theme="dark"')
				? 'dark'
				: 'light';
		for (const [, name = '', value = ''] of body.matchAll(
			/(--[\w-]+)\s*:\s*([^;]+);/g,
		)) {
			themes[theme][name] = value.trim();
		}
	}
	return themes;
};

const buildBundle = async (): Promise<string> => {
	const source = await Bun.file(DESIGN_SOURCE).text();
	const result = await Bun.build({
		entrypoints: [DESIGN_SOURCE],
		format: 'iife',
		target: 'browser',
		minify: { syntax: true, identifiers: true },
	});
	const [output] = result.outputs;
	if (!result.success || !output) {
		throw new AggregateError(result.logs, 'Design bundle failed to build');
	}
	return (
		bundleHeader(componentNames(source), sourceHash(source)) +
		(await output.text())
	);
};

if (import.meta.main) {
	await Bun.write(DESIGN_BUNDLE, await buildBundle());
	const designCss = await Bun.file(DESIGN_CSS).text();
	await Bun.write(SITE_CSS, SITE_CSS_HEADER + cssBody(designCss));
	console.log(`Built ${DESIGN_BUNDLE} and copied ${DESIGN_CSS} to ${SITE_CSS}`);
}
