import { navLinks, type Route, site } from "../site";

export const Nav = ({ current }: { current?: Route }) => (
	<nav class="sc-nav" aria-label="Main">
		<a class="sc-nav__name" href="/">
			{site.name}
		</a>
		<ul class="sc-nav__links">
			{navLinks.map((link) => (
				<li>
					<a
						href={link.href}
						aria-current={link.href === current ? "page" : undefined}
					>
						{link.label}
					</a>
				</li>
			))}
		</ul>
	</nav>
);
