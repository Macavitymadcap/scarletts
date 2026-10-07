import { describe, expect, test } from "bun:test";
import { fileFor, render } from "../src/build";
import { Nav } from "../src/components/Nav";
import { Bio } from "../src/pages/bio";
import { Home } from "../src/pages/home";
import { NotFound } from "../src/pages/not-found";

describe("fileFor", () => {
	test("maps routes to flat HTML files", () => {
		// Arrange
		const routes = ["/", "/bio", "/photos"] as const;

		// Act
		const files = routes.map(fileFor);

		// Assert
		expect(files).toEqual(["index.html", "bio.html", "photos.html"]);
	});
});

describe("Nav", () => {
	test("marks only the current page", async () => {
		// Arrange
		const nav = <Nav current="/bio" />;

		// Act
		const html = await nav.toString();

		// Assert
		expect(html).toContain('<a href="/bio" aria-current="page">Bio</a>');
		expect(html.match(/aria-current/g)).toHaveLength(1);
	});
});

describe("pages", () => {
	test("home shows the coming-soon state when no gigs are listed", async () => {
		// Arrange
		const Page = Home;

		// Act
		const html = await render(Page);

		// Assert
		expect(html.startsWith("<!doctype html>")).toBe(true);
		expect(html).toContain("Coming soon");
		expect(html).toContain('href="mailto:bookings@scarletts.uk"');
	});

	test("bio has a titled document and a single h1", async () => {
		// Arrange
		const Page = Bio;

		// Act
		const html = await render(Page);

		// Assert
		expect(html).toContain("<title>Bio | Scarletts</title>");
		expect(html.match(/<h1/g)).toHaveLength(1);
	});

	test("the 404 page has no canonical link", async () => {
		// Arrange
		const Page = NotFound;

		// Act
		const html = await render(Page);

		// Assert
		expect(html).not.toContain('rel="canonical"');
	});
});
