import type { Child } from 'hono/jsx';

const cx = (...classes: (string | false | undefined | null)[]) =>
	classes.filter(Boolean).join(' ');

export type ButtonProps = {
	href: string;
	variant?: 'primary' | 'secondary';
	children: Child;
};

export const Button = ({
	href,
	variant = 'primary',
	children,
}: ButtonProps) => (
	<a href={href} class={cx('sc-btn', `sc-btn--${variant}`)}>
		{children}
	</a>
);

export type TapeProps = {
	tone?: 'ink' | 'scarlet';
	tilt?: 'left' | 'right';
	children: Child;
};

export const Tape = ({ tone = 'ink', tilt = 'left', children }: TapeProps) => (
	<span class={cx('sc-tape', `sc-tape--${tone}`, `sc-tape--${tilt}`)}>
		{children}
	</span>
);

export type StickerProps = { tone?: 'gold' | 'scarlet'; children: Child };

export const Sticker = ({ tone = 'gold', children }: StickerProps) => (
	<span class={cx('sc-sticker', `sc-sticker--${tone}`)}>{children}</span>
);

export const Checkerboard = ({ rows = 1 }: { rows?: number }) => (
	<div
		class="sc-checker"
		aria-hidden="true"
		style={`height: calc(var(--space-8) * ${rows})`}
	/>
);

export const Tricolour = () => (
	<div class="sc-tricolour" aria-hidden="true">
		<span />
		<span />
		<span />
	</div>
);

export type SectionProps = {
	id: string;
	title: string;
	aside?: Child;
	children: Child;
};

export const Section = ({ id, title, aside, children }: SectionProps) => (
	<section class="section" aria-labelledby={id}>
		<div class="section__head">
			<h2 class="section__title" id={id}>
				{title}
			</h2>
			{aside}
		</div>
		{children}
	</section>
);

export type MastheadProps = {
	kicker: string;
	title: Child;
	intro?: string;
	sticker?: Child;
};

export const Masthead = ({ kicker, title, intro, sticker }: MastheadProps) => (
	<header class="masthead">
		<p class="masthead__kicker">{kicker}</p>
		<h1 class="masthead__title">{title}</h1>
		{intro && <p class="masthead__intro">{intro}</p>}
		{sticker}
	</header>
);
