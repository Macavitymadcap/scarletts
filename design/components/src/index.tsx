/** @jsxRuntime classic */
/** @jsx h */
// Scarletts components. Plain function components that only set class names,
// so they port to hono/jsx on the site unchanged (swap className for class if preferred).
const R = (window as any).React;
const h = R.createElement;
const Fragment = R.Fragment;

type Children = any;
const cx = (...c: (string | false | undefined | null)[]) =>
	c.filter(Boolean).join(" ");

export type ButtonProps = {
	variant?: "primary" | "secondary";
	href?: string;
	children?: Children;
	[rest: string]: any;
};
export function Button({
	variant = "primary",
	href,
	children,
	className,
	...rest
}: ButtonProps) {
	const cls = cx("sc-btn", `sc-btn--${variant}`, className);
	return href ? (
		<a {...rest} href={href} className={cls}>
			{children}
		</a>
	) : (
		<button type="button" {...rest} className={cls}>
			{children}
		</button>
	);
}

export type NavLink = { label: string; href: string; current?: boolean };
export type NavProps = { links: NavLink[]; homeHref?: string };
export function Nav({ links, homeHref = "/" }: NavProps) {
	return (
		<nav className="sc-nav" aria-label="Main">
			<a className="sc-nav__name" href={homeHref}>
				Scarletts
			</a>
			<ul className="sc-nav__links">
				{links.map((l) => (
					<li key={l.href}>
						<a href={l.href} aria-current={l.current ? "page" : undefined}>
							{l.label}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}

export type TapeProps = {
	tone?: "ink" | "scarlet";
	tilt?: "left" | "right";
	children?: Children;
};
export function Tape({ tone = "ink", tilt = "left", children }: TapeProps) {
	return (
		<span className={cx("sc-tape", `sc-tape--${tone}`, `sc-tape--${tilt}`)}>
			{children}
		</span>
	);
}

export type StickerProps = { tone?: "gold" | "scarlet"; children?: Children };
export function Sticker({ tone = "gold", children }: StickerProps) {
	return (
		<span className={cx("sc-sticker", `sc-sticker--${tone}`)}>{children}</span>
	);
}

export type GigStatus = "on-sale" | "sold-out" | "free";
export type GigCardProps = {
	weekday: string; // "Sat"
	day: number; // 14
	month: string; // "Nov"
	venue: string;
	city: string;
	details?: string; // "Doors 8pm. £8 on the door."
	status?: GigStatus;
	ticketsHref?: string;
};
export function GigCard({
	weekday,
	day,
	month,
	venue,
	city,
	details,
	status = "on-sale",
	ticketsHref,
}: GigCardProps) {
	return (
		<article className="sc-gig">
			<div className="sc-gig__date">
				<span className="sc-gig__weekday">{weekday}</span>
				<span className="sc-gig__day">{day}</span>
				<span className="sc-gig__month">{month}</span>
			</div>
			<div className="sc-gig__body">
				<h3 className="sc-gig__venue">{venue}</h3>
				<p className="sc-gig__city">{city}</p>
				{details && <p className="sc-gig__details">{details}</p>}
				<div className="sc-gig__action">
					{status === "sold-out" ? (
						<Tape tone="ink" tilt="left">
							Sold out
						</Tape>
					) : status === "free" ? (
						<Tape tone="scarlet" tilt="right">
							Free entry
						</Tape>
					) : ticketsHref ? (
						<Button href={ticketsHref}>Get tickets</Button>
					) : null}
				</div>
			</div>
		</article>
	);
}

export type PhotoProps = {
	src: string;
	alt: string;
	width: number;
	height: number;
	credit?: string;
	sticker?: Children;
};
export function Photo({
	src,
	alt,
	width,
	height,
	credit,
	sticker,
}: PhotoProps) {
	return (
		<figure className="sc-photo">
			<div className="sc-photo__frame">
				<img src={src} alt={alt} width={width} height={height} loading="lazy" />
				{sticker && (
					<span className="sc-photo__sticker">
						<Sticker>{sticker}</Sticker>
					</span>
				)}
			</div>
			{credit && <figcaption className="sc-photo__credit">{credit}</figcaption>}
		</figure>
	);
}

export type CheckerboardProps = { rows?: number };
export function Checkerboard({ rows = 1 }: CheckerboardProps) {
	return (
		<div
			className="sc-checker"
			aria-hidden="true"
			style={{ height: `calc(var(--space-8) * ${rows})` }}
		/>
	);
}

export function Tricolour() {
	return (
		<div className="sc-tricolour" aria-hidden="true">
			<span />
			<span />
			<span />
		</div>
	);
}

export type Track = {
	title: string;
	src: string;
	duration: string;
	note?: string;
	isNew?: boolean;
};
export type TrackListProps = { tracks: Track[] };
// Native <audio controls preload="none"> per track: no client JavaScript, and nothing downloads until play.
export function TrackList({ tracks }: TrackListProps) {
	return (
		<ol className="sc-tracks">
			{tracks.map((t, i) => (
				<li className="sc-track" key={t.src}>
					<span className="sc-track__num" aria-hidden="true">
						{String(i + 1).padStart(2, "0")}
					</span>
					<div className="sc-track__info">
						<div className="sc-track__head">
							<h3 className="sc-track__title">{t.title}</h3>
							{t.isNew && (
								<Tape tone="scarlet" tilt="right">
									New
								</Tape>
							)}
						</div>
						{t.note && <p className="sc-track__note">{t.note}</p>}
					</div>
					<span className="sc-track__time">
						<span className="sc-visually-hidden">Length </span>
						{t.duration}
					</span>
					<audio
						className="sc-track__audio"
						controls
						preload="none"
						src={t.src}
						aria-label={`Play ${t.title}`}
					/>
				</li>
			))}
		</ol>
	);
}

export type Member = { name: string; role: string };
export type LineUpProps = { members: Member[] };
// Flush tiles, one per band member: role in stamp type above the name.
export function LineUp({ members }: LineUpProps) {
	return (
		<ul className="sc-lineup">
			{members.map((m) => (
				<li className="sc-lineup__member" key={m.name}>
					<span className="sc-lineup__role">{m.role}</span>
					<span className="sc-lineup__name">{m.name}</span>
				</li>
			))}
		</ul>
	);
}

export type GridPhoto = {
	src: string;
	full?: string;
	alt: string;
	width: number;
	height: number;
};
export type PhotoGridProps = { photos: GridPhoto[]; feature?: boolean };
// Flush tiles cropped to 4:3, each linking to the full-size image; no client JavaScript.
export function PhotoGrid({ photos, feature = true }: PhotoGridProps) {
	return (
		<ul className={cx("sc-grid", feature && "sc-grid--feature")}>
			{photos.map((p) => (
				<li className="sc-grid__item" key={p.src}>
					<a className="sc-grid__link" href={p.full ?? p.src}>
						<img
							src={p.src}
							alt={p.alt}
							width={p.width}
							height={p.height}
							loading="lazy"
						/>
					</a>
				</li>
			))}
		</ul>
	);
}

const Scarletts = {
	Button,
	Nav,
	Tape,
	Sticker,
	GigCard,
	Photo,
	Checkerboard,
	Tricolour,
	TrackList,
	LineUp,
	PhotoGrid,
};
(window as any).Scarletts = Object.assign(
	(window as any).Scarletts || {},
	Scarletts,
);
void Fragment;
