export const site = {
	name: "Scarletts",
	url: "https://scarletts.uk",
	pitch: "Ska and other music you can dance to, out of Bristol.",
	bookingsEmail: "bookings@scarletts.uk",
} as const;

export type Route = "/" | "/bio" | "/photos";

export const navLinks: { label: string; href: Route }[] = [
	{ label: "Home", href: "/" },
	{ label: "Bio", href: "/bio" },
	{ label: "Photos", href: "/photos" },
];

export type Social = { label: string; href: string };

// Add each account once it exists; the footer only shows links listed here.
export const socials: Social[] = [
	{ label: "Instagram", href: "https://www.instagram.com/scarletts.band" },
	{ label: "YouTube", href: "https://www.youtube.com/@scarlettsbandmusic" },
	{ label: "Bandcamp", href: "https://scarletts.bandcamp.com" },
];
