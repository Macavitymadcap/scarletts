import { describe, expect, test } from 'bun:test';
import { LineUp } from '../src/components/LineUp';
import type { Member } from '../src/content/bio';
import type { Photo } from '../src/content/photos';

const portrait: Photo = {
	key: 'photos/members/dan',
	group: 'members',
	alt: 'Dan holding a bass',
	width: 1600,
	height: 1600,
};

const renderLineUp = async (members: Member[]) =>
	(await (<LineUp members={members} />).toString()) as string;

describe('LineUp', () => {
	test('renders one tile per member', async () => {
		// Arrange
		const members: Member[] = [
			{ name: 'Dan', role: 'Bass' },
			{ name: 'Callum', role: 'Drums' },
		];

		// Act
		const html = await renderLineUp(members);

		// Assert
		expect(html.match(/class="sc-lineup__member"/g)).toHaveLength(2);
	});

	test('renders nothing inside the list when there are no members', async () => {
		// Arrange
		const members: Member[] = [];

		// Act
		const html = await renderLineUp(members);

		// Assert
		expect(html).toBe('<ul class="sc-lineup"></ul>');
	});

	test('puts each name in a heading', async () => {
		// Arrange
		const members: Member[] = [{ name: 'Dan', role: 'Bass' }];

		// Act
		const html = await renderLineUp(members);

		// Assert
		expect(html).toContain('<h3 class="sc-lineup__name">Dan</h3>');
	});

	test('shows the role', async () => {
		// Arrange
		const members: Member[] = [{ name: 'Dan', role: 'Bass' }];

		// Act
		const html = await renderLineUp(members);

		// Assert
		expect(html).toContain('<span class="sc-lineup__role">Bass</span>');
	});

	test('shows the 800 px portrait with its alt text when there is a photo', async () => {
		// Arrange
		const members: Member[] = [{ name: 'Dan', role: 'Bass', photo: portrait }];

		// Act
		const html = await renderLineUp(members);

		// Assert
		expect(html).toMatch(
			/<img src="[^"]*\/photos\/members\/dan-800\.webp" alt="Dan holding a bass"/,
		);
	});

	test('does not show the initial when there is a photo', async () => {
		// Arrange
		const members: Member[] = [{ name: 'Dan', role: 'Bass', photo: portrait }];

		// Act
		const html = await renderLineUp(members);

		// Assert
		expect(html).not.toContain('sc-lineup__photo--empty');
	});

	test('shows a hidden initial in place of a missing photo', async () => {
		// Arrange
		const members: Member[] = [{ name: 'Dan', role: 'Bass' }];

		// Act
		const html = await renderLineUp(members);

		// Assert
		expect(html).toContain(
			'<div class="sc-lineup__photo sc-lineup__photo--empty" aria-hidden="true">D</div>',
		);
	});

	test('shows no image when there is no photo', async () => {
		// Arrange
		const members: Member[] = [{ name: 'Dan', role: 'Bass' }];

		// Act
		const html = await renderLineUp(members);

		// Assert
		expect(html).not.toContain('<img');
	});

	test('shows the bio when there is one', async () => {
		// Arrange
		const members: Member[] = [
			{ name: 'Dan', role: 'Bass', bio: 'Holds down the low end.' },
		];

		// Act
		const html = await renderLineUp(members);

		// Assert
		expect(html).toContain(
			'<p class="sc-lineup__bio">Holds down the low end.</p>',
		);
	});

	test('leaves out the bio paragraph when there is no bio', async () => {
		// Arrange
		const members: Member[] = [{ name: 'Dan', role: 'Bass' }];

		// Act
		const html = await renderLineUp(members);

		// Assert
		expect(html).not.toContain('sc-lineup__bio');
	});

	test('leaves out the bio paragraph when the bio is empty', async () => {
		// Arrange
		const members: Member[] = [{ name: 'Dan', role: 'Bass', bio: '' }];

		// Act
		const html = await renderLineUp(members);

		// Assert
		expect(html).not.toContain('sc-lineup__bio');
	});

	test('escapes markup in a bio', async () => {
		// Arrange
		const members: Member[] = [
			{ name: 'Dan', role: 'Bass', bio: 'Bass & <b>more</b>' },
		];

		// Act
		const html = await renderLineUp(members);

		// Assert
		expect(html).toContain('Bass &amp; &lt;b&gt;more&lt;/b&gt;');
	});

	test('keeps members in the order given', async () => {
		// Arrange
		const members: Member[] = [
			{ name: 'Mancini', role: 'Vocals' },
			{ name: 'Callum', role: 'Drums' },
		];

		// Act
		const html = await renderLineUp(members);

		// Assert
		expect(html.indexOf('Mancini')).toBeLessThan(html.indexOf('Callum'));
	});
});
