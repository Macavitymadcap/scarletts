import type { Child } from 'hono/jsx';
import { Tricolour } from '../../components/ui';
import { site } from '../../site';
import type { Member } from '../db';

export type CrewSection = 'calendar' | 'settings';

const FONTS =
	'https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;800&family=Special+Elite&display=swap';

// htmx 2 ignores 4xx responses by default; swapping 422 shows form errors.
const HTMX_CONFIG = JSON.stringify({
	responseHandling: [
		{ code: '204', swap: false },
		{ code: '[23]..', swap: true },
		{ code: '422', swap: true },
		{ code: '[45]..', swap: false, error: true },
	],
});

const links: { section: CrewSection; label: string; href: string }[] = [
	{ section: 'calendar', label: 'Calendar', href: '/crew' },
	{ section: 'settings', label: 'Feed & publishing', href: '/crew/settings' },
];

export type CrewLayoutProps = {
	title: string;
	member: Member;
	current?: CrewSection;
	children: Child;
};

export const CrewLayout = ({
	title,
	member,
	current,
	children,
}: CrewLayoutProps) => (
	<html lang="en-GB">
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="robots" content="noindex, nofollow" />
			<meta name="color-scheme" content="light dark" />
			<meta name="htmx-config" content={HTMX_CONFIG} />
			<title>{`${title} | ${site.name} crew`}</title>
			<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
			<link rel="stylesheet" href={FONTS} />
			<link rel="stylesheet" href="/styles/tokens.css" />
			<link rel="stylesheet" href="/styles/components.css" />
			<link rel="stylesheet" href="/styles/pages.css" />
			<link rel="stylesheet" href="/styles/crew.css" />
			<script src="/scripts/htmx.min.js" defer />
		</head>
		<body hx-boost="true">
			<div class="page">
				<Tricolour />
				<header class="sc-nav crew-nav">
					<a class="sc-nav__name" href="/crew">
						{site.name} crew
					</a>
					<nav aria-label="Crew">
						<ul class="sc-nav__links">
							{links.map((link) => (
								<li>
									<a
										href={link.href}
										aria-current={link.section === current ? 'page' : undefined}
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</nav>
					<p class="crew-nav__member">Signed in as {member.name}</p>
				</header>
				<main id="content" class="page__main crew-main">
					{children}
				</main>
			</div>
		</body>
	</html>
);

export const ErrorList = ({ errors }: { errors: string[] }) =>
	errors.length === 0 ? null : (
		<div class="crew-errors" role="alert">
			<p>That didn't save:</p>
			<ul>
				{errors.map((error) => (
					<li>{error}</li>
				))}
			</ul>
		</div>
	);
