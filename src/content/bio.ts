export type Member = { name: string; role: string };

export const bio = {
	lede: 'Ska and other music you can dance to, out of Bristol.',
	paragraphs: [
		'Scarletts found themselves in the same corner of Bristol after extensively circulating festivals for decades. Through their combine love of good times, basslines, brass and debauchery, they created a sound of their own.',
		'Expect bouncy, catchy beats, steamy guitar riffs, soulful vocals, blusey grooves, honest lyrics and brass hooks to get your knees up',
		'Watch this space for gig announcements, new recordings and other shenanigans in the future.',
	],
	members: [
		{ name: 'Cini', role: 'Vocals' },
		{ name: 'Liv', role: 'Trumpet & Vocals' },
		{ name: 'Paul', role: 'Guitar' },
		{ name: 'Isaac', role: 'Saxophone & Keys' },
		{ name: 'Dan', role: 'Bass' },
		{ name: 'Callum', role: 'Drums' },
	] satisfies Member[],
	influences: ["Mungo's Hi Fi", 'No Doubt', 'Madness'],
};
