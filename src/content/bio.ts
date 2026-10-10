export type Member = { name: string; role: string };

export type Review = { content: string; source: string; citation?: string };

export const bio = {
	lede: 'Ska and other music you can dance to, out of Bristol.',
	paragraphs: [
		'We found ourselves in the same corner of Bristol after circulating festivals for decades. Through our combined love of good times, basslines, brass and debauchery, we have created a sound all our own.',
		'Expect bouncy, catchy beats; steamy guitar riffs; soulful vocals; bluesy grooves; honest lyrics and brass hooks to get your knees up. We mainly serve up ska, but with a touch of funk, a sprinkle of punk and a goodly pinch of this and that.',
		"We've got a few things brewing at the moment; applying for festivals, recording some demos and much more. Watch this space and our socials to make sure you don't miss out.",
	],
	members: [
		{ name: 'Mancini', role: 'Vocals' },
		{ name: 'Liv', role: 'Trumpet & Vocals' },
		{ name: 'Paul', role: 'Guitar' },
		{ name: 'Isaac', role: 'Saxophone & Keys' },
		{ name: 'Dan', role: 'Bass' },
		{ name: 'Callum', role: 'Drums' },
	] satisfies Member[],
	reviews: [] satisfies Review[],
	influences: [
		"Fat Freddy's Drop",
		'Cat Empire',
		'Chainska Brassika',
		'Dutty Moonshine Big Band',
		'Sublime',
		'Amyl and the Sniffers',
		'No Doubt',
		'Paramore',
		'Fontaines D.C.',
		'The Clash',
		'The Distillers',
		'Kneecap',
		'Stevie Wonder',
		'Funkadelic',
		'Parliament',
		'Rage Against the Machine',
		'Electric Wizard',
		'Kurupt FM',
		'System of a Down',
		'Charles Mingus',
		'Herbie Hancock',
		'Linkin Park',
		'School of Rock (the movie)',
		'Miss Millies (fried chicken chain)',
		'The Old Stillage (Bristol pub)',
	],
};
