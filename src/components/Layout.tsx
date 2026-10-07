import type { Child } from 'hono/jsx';
import { type Route, site } from '../site';
import { Footer } from './Footer';
import { Nav } from './Nav';
import { Checkerboard, Tricolour } from './ui';

export type LayoutProps = {
	title?: string; // omitted on the home page
	description?: string;
	current?: Route;
	ogImage?: string;
	children: Child;
};

const FONTS =
	'https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;800&family=Special+Elite&display=swap';

export const Layout = ({
	title,
	description = site.pitch,
	current,
	ogImage,
	children,
}: LayoutProps) => {
	const fullTitle = title
		? `${title} | ${site.name}`
		: `${site.name} | Ska from Bristol`;
	// The 404 page has no route, so it gets no canonical or og:url.
	const canonical = current && `${site.url}${current === '/' ? '/' : current}`;

	return (
		<html lang="en-GB">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>{fullTitle}</title>
				<meta name="description" content={description} />
				<meta name="color-scheme" content="light dark" />
				{canonical && <link rel="canonical" href={canonical} />}
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
				<meta property="og:type" content="website" />
				<meta property="og:title" content={fullTitle} />
				<meta property="og:description" content={description} />
				{canonical && <meta property="og:url" content={canonical} />}
				{ogImage && <meta property="og:image" content={ogImage} />}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossorigin=""
				/>
				<link rel="stylesheet" href={FONTS} />
				<link rel="stylesheet" href="/styles/tokens.css" />
				<link rel="stylesheet" href="/styles/components.css" />
				<link rel="stylesheet" href="/styles/pages.css" />
			</head>
			<body>
				<a class="skip-link" href="#content">
					Skip to content
				</a>
				<div class="page">
					<Tricolour />
					<Nav current={current} />
					<main id="content" class="page__main">
						{children}
					</main>
					<Checkerboard />
					<Footer />
				</div>
			</body>
		</html>
	);
};
