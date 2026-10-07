import type * as React from "react";
export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary";
	href?: string;
	children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): React.ReactElement;
export interface NavLink {
	label: string;
	href: string;
	current?: boolean;
}
export interface NavProps {
	links: NavLink[];
	homeHref?: string;
}
export declare function Nav(props: NavProps): React.ReactElement;
export interface TapeProps {
	tone?: "ink" | "scarlet";
	tilt?: "left" | "right";
	children?: React.ReactNode;
}
export declare function Tape(props: TapeProps): React.ReactElement;
export interface StickerProps {
	tone?: "gold" | "scarlet";
	children?: React.ReactNode;
}
export declare function Sticker(props: StickerProps): React.ReactElement;
export interface GigCardProps {
	weekday: string;
	day: number;
	month: string;
	venue: string;
	city: string;
	details?: string;
	status?: "on-sale" | "sold-out" | "free";
	ticketsHref?: string;
}
export declare function GigCard(props: GigCardProps): React.ReactElement;
export interface PhotoProps {
	src: string;
	alt: string;
	width: number;
	height: number;
	credit?: string;
	sticker?: React.ReactNode;
}
export declare function Photo(props: PhotoProps): React.ReactElement;
export interface CheckerboardProps {
	rows?: number;
}
export declare function Checkerboard(
	props: CheckerboardProps,
): React.ReactElement;
export type TricolourProps = {};
export declare function Tricolour(props: TricolourProps): React.ReactElement;
export interface Track {
	title: string;
	src: string;
	duration: string;
	note?: string;
	isNew?: boolean;
}
export interface TrackListProps {
	tracks: Track[];
}
export declare function TrackList(props: TrackListProps): React.ReactElement;
export interface Member {
	name: string;
	role: string;
}
export interface LineUpProps {
	members: Member[];
}
export declare function LineUp(props: LineUpProps): React.ReactElement;
export interface GridPhoto {
	src: string;
	full?: string;
	alt: string;
	width: number;
	height: number;
}
export interface PhotoGridProps {
	photos: GridPhoto[];
	feature?: boolean;
}
export declare function PhotoGrid(props: PhotoGridProps): React.ReactElement;
declare global {
	interface Window {
		Scarletts: {
			Button: typeof Button;
			Nav: typeof Nav;
			Tape: typeof Tape;
			Sticker: typeof Sticker;
			GigCard: typeof GigCard;
			Photo: typeof Photo;
			Checkerboard: typeof Checkerboard;
			Tricolour: typeof Tricolour;
			TrackList: typeof TrackList;
			LineUp: typeof LineUp;
			PhotoGrid: typeof PhotoGrid;
		};
	}
}
