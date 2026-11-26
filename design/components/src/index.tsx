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

export type TicketStatus = "on-sale" | "sold-out";
export type Ticket = { status: TicketStatus; href: string };
export type GigCardProps = {
	date?: string; // ISO date for <time datetime>, e.g. "2026-11-14"
	weekday: string; // "Sat"
	day: number; // 14
	month: string; // "Nov"
	venue: string;
	city: string;
	details?: string; // "Doors 8pm. £8 on the door."
	ticket?: Ticket;
	eventHref?: string;
};
// The action is "Get tickets" while on sale, a "Sold out" tape once sold out,
// otherwise an "Event page" button when there is one.
export function GigCard({
	date,
	weekday,
	day,
	month,
	venue,
	city,
	details,
	ticket,
	eventHref,
}: GigCardProps) {
	return (
		<article className="sc-gig">
			<time className="sc-gig__date" dateTime={date}>
				<span className="sc-gig__weekday">{weekday}</span>
				<span className="sc-gig__day">{day}</span>
				<span className="sc-gig__month">{month}</span>
			</time>
			<div className="sc-gig__body">
				<h3 className="sc-gig__venue">{venue}</h3>
				<p className="sc-gig__city">{city}</p>
				{details && <p className="sc-gig__details">{details}</p>}
				<div className="sc-gig__action">
					{ticket?.status === "on-sale" ? (
						<Button href={ticket.href}>Get tickets</Button>
					) : ticket?.status === "sold-out" ? (
						<Tape tone="ink" tilt="left">
							Sold out
						</Tape>
					) : eventHref ? (
						<Button href={eventHref}>Event page</Button>
					) : null}
				</div>
			</div>
		</article>
	);
}

export type PhotoProps = {
	src: string; // the 800 px version
	full?: string; // the 1600 px version, offered through srcset
	alt: string;
	width: number;
	height: number;
	credit?: string;
	sticker?: Children;
};
export function Photo({
	src,
	full,
	alt,
	width,
	height,
	credit,
	sticker,
}: PhotoProps) {
	return (
		<figure className="sc-photo">
			<div className="sc-photo__frame">
				<img
					src={src}
					srcSet={full ? `${src} 800w, ${full} 1600w` : undefined}
					sizes={full ? "(min-width: 800px) 40vw, 100vw" : undefined}
					alt={alt}
					width={width}
					height={height}
					loading="lazy"
				/>
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

export type MemberPhoto = {
	src: string; // the 800 px version
	alt: string;
	width: number;
	height: number;
};
export type Member = {
	name: string;
	role: string;
	bio?: string; // a sentence or two
	photo?: MemberPhoto;
};
export type LineUpProps = { members: Member[] };
// Flush tiles, one per band member: a square portrait above the role in stamp
// type, the name, and an optional short bio. Without a portrait, the initial
// on a paper block keeps every tile the same height.
export function LineUp({ members }: LineUpProps) {
	return (
		<ul className="sc-lineup">
			{members.map((m) => (
				<li className="sc-lineup__member" key={m.name}>
					{m.photo ? (
						<div className="sc-lineup__photo">
							<img
								src={m.photo.src}
								alt={m.photo.alt}
								width={m.photo.width}
								height={m.photo.height}
								loading="lazy"
							/>
						</div>
					) : (
						<div
							className="sc-lineup__photo sc-lineup__photo--empty"
							aria-hidden="true"
						>
							{m.name.charAt(0)}
						</div>
					)}
					<div className="sc-lineup__text">
						<span className="sc-lineup__role">{m.role}</span>
						<h3 className="sc-lineup__name">{m.name}</h3>
						{m.bio && <p className="sc-lineup__bio">{m.bio}</p>}
					</div>
				</li>
			))}
		</ul>
	);
}

export type Review = { content: string; source: string; citation?: string };
export type ReviewsProps = { reviews: Review[] };
export function ReviewQuote({ review }: { review: Review }) {
	return (
		<figure className="sc-review">
			<blockquote className="sc-review__quote" cite={review.citation}>
				<p className="sc-review__content">{review.content}</p>
			</blockquote>
			<figcaption className="sc-review__source">
				{review.citation ? (
					<a href={review.citation}>{review.source}</a>
				) : (
					review.source
				)}
			</figcaption>
		</figure>
	);
}
// Flush tiles, like the line-up: quote in bold body type, source in stamp type.
export function Reviews({ reviews }: ReviewsProps) {
	return (
		<ul className="sc-reviews">
			{reviews.map((r) => (
				<li className="sc-reviews__item" key={r.content}>
					<ReviewQuote review={r} />
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
	Reviews,
	PhotoGrid,
};
(window as any).Scarletts = Object.assign(
	(window as any).Scarletts || {},
	Scarletts,
);
void Fragment;
