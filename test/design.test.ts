import { describe, expect, test } from 'bun:test';
import {
	bundleHeader,
	bundleSourceHash,
	componentNames,
	cssBody,
	DESIGN_BUNDLE,
	DESIGN_CSS,
	DESIGN_SOURCE,
	DESIGN_TOKENS,
	SITE_CSS,
	SITE_CSS_HEADER,
	SITE_TOKENS,
	sourceHash,
	themeProperties,
} from '../scripts/design';

const read = (path: string) => Bun.file(path).text();

describe('sourceHash', () => {
	test('gives the same hash for the same source', () => {
		// Arrange
		const source = 'export const a = 1;';

		// Act
		const hash = sourceHash(source);

		// Assert
		expect(hash).toBe(sourceHash('export const a = 1;'));
	});

	test('gives a different hash when the source changes', () => {
		// Arrange
		const source = 'export const a = 2;';

		// Act
		const hash = sourceHash(source);

		// Assert
		expect(hash).not.toBe(sourceHash('export const a = 1;'));
	});
});

describe('componentNames', () => {
	test('lists the registered components in source order', () => {
		// Arrange
		const source = 'const Scarletts = {\n\tButton,\n\tNav,\n\tLineUp,\n};';

		// Act
		const names = componentNames(source);

		// Assert
		expect(names).toEqual(['Button', 'Nav', 'LineUp']);
	});

	test('handles a single component without a trailing comma', () => {
		// Arrange
		const source = 'const Scarletts = { Button };';

		// Act
		const names = componentNames(source);

		// Assert
		expect(names).toEqual(['Button']);
	});

	test('gives no names for an empty registry', () => {
		// Arrange
		const source = 'const Scarletts = {};';

		// Act
		const names = componentNames(source);

		// Assert
		expect(names).toEqual([]);
	});

	test('throws when the source has no registry', () => {
		// Arrange
		const source = 'export const Button = () => null;';

		// Act
		const act = () => componentNames(source);

		// Assert
		expect(act).toThrow('No `const Scarletts');
	});
});

describe('bundleHeader', () => {
	test('lists each component for the design tool', () => {
		// Arrange
		const names = ['Button', 'Nav'];

		// Act
		const header = bundleHeader(names, 'abc');

		// Assert
		expect(header).toStartWith(
			'/* @ds-bundle: {"format":4,"namespace":"Scarletts","components":[{"name":"Button"},{"name":"Nav"}]} */\n',
		);
	});

	test('records the source hash where bundleSourceHash finds it', () => {
		// Arrange
		const header = bundleHeader(['Button'], 'abc123');

		// Act
		const hash = bundleSourceHash(`${header}(() => {})();`);

		// Assert
		expect(hash).toBe('abc123');
	});
});

describe('bundleSourceHash', () => {
	test('is undefined for a bundle without a hash', () => {
		// Arrange
		const bundle = '/* @ds-bundle: {} */\n(() => {})();';

		// Act
		const hash = bundleSourceHash(bundle);

		// Assert
		expect(hash).toBeUndefined();
	});
});

describe('cssBody', () => {
	test('drops everything before the first :where( rule', () => {
		// Arrange
		const css = '@import url("fonts");\nbody { color: red; }\n:where(a) {}';

		// Act
		const body = cssBody(css);

		// Assert
		expect(body).toBe(':where(a) {}');
	});

	test('throws when there is no :where( rule', () => {
		// Arrange
		const css = 'body { color: red; }';

		// Act
		const act = () => cssBody(css);

		// Assert
		expect(act).toThrow('No `:where(` rule');
	});
});

describe('themeProperties', () => {
	const css = `
:root { --paper: white; --space-1: 4px; color-scheme: light; }
@media (prefers-color-scheme: dark) {
	:root:not([data-theme="light"]) { --paper: black; }
}
:root[data-theme="dark"] { --paper: black; }
.title { font-size: 28px; }`;

	test('collects light properties from plain rules', () => {
		// Arrange
		const tokens = css;

		// Act
		const { light } = themeProperties(tokens);

		// Assert
		expect(light).toEqual({ '--paper': 'white', '--space-1': '4px' });
	});

	test('collects Night properties set by data-theme', () => {
		// Arrange
		const tokens = css;

		// Act
		const { dark } = themeProperties(tokens);

		// Assert
		expect(dark).toEqual({ '--paper': 'black' });
	});

	test('collects Night properties set by the system setting', () => {
		// Arrange
		const tokens = css;

		// Act
		const { darkBySystem } = themeProperties(tokens);

		// Assert
		expect(darkBySystem).toEqual({ '--paper': 'black' });
	});

	test('gives empty themes for CSS without custom properties', () => {
		// Arrange
		const tokens = '.title { font-size: 28px; }';

		// Act
		const themes = themeProperties(tokens);

		// Assert
		expect(themes).toEqual({ light: {}, dark: {}, darkBySystem: {} });
	});
});

// The design system is the source of truth; these fail when the site or the
// bundle falls behind it. Run `bun run design:build` to fix them.
describe('design system', () => {
	test('bundle.js was built from the current component source', async () => {
		// Arrange
		const [source, bundle] = await Promise.all([
			read(DESIGN_SOURCE),
			read(DESIGN_BUNDLE),
		]);

		// Act
		const builtFrom = bundleSourceHash(bundle);

		// Assert
		expect(builtFrom).toBe(sourceHash(source));
	});

	test('site component CSS is the design bundle CSS', async () => {
		// Arrange
		const [designCss, siteCss] = await Promise.all([
			read(DESIGN_CSS),
			read(SITE_CSS),
		]);

		// Act
		const expected = SITE_CSS_HEADER + cssBody(designCss);

		// Assert
		expect(siteCss).toBe(expected);
	});

	test('site tokens have the same values as the design tokens', async () => {
		// Arrange
		const [designTokens, siteTokens] = await Promise.all([
			read(DESIGN_TOKENS),
			read(SITE_TOKENS),
		]);

		// Act
		const site = themeProperties(siteTokens);

		// Assert
		expect(site).toEqual(themeProperties(designTokens));
	});

	test('Night is the same whether chosen by the system or by data-theme', async () => {
		// Arrange
		const designTokens = await read(DESIGN_TOKENS);

		// Act
		const { dark, darkBySystem } = themeProperties(designTokens);

		// Assert
		expect(darkBySystem).toEqual(dark);
	});
});
