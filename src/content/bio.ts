export type Member = { name: string; role: string };

export const bio = {
	lede: "Ska and other music you can dance to, out of Bristol.",
	// TODO: replace with the real story.
	paragraphs: [
		"[How the band started, two or three sentences.]",
		"[What a Scarletts gig is like, and where we play.]",
		"[What is coming next, such as the new recordings.]",
	],
	// TODO: the real line-up. The first member gets the scarlet tile.
	members: [
		{ name: "Member one", role: "Instrument" },
		{ name: "Member two", role: "Instrument" },
		{ name: "Member three", role: "Instrument" },
	] satisfies Member[],
	// TODO: the real influences.
	influences: ["Influence one", "Influence two", "Influence three"],
};
