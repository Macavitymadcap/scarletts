import type { Child } from "hono/jsx";
import { type Photo as PhotoData, photoUrl } from "../content/photos";
import { Sticker } from "./ui";

export type PhotoProps = { photo: PhotoData; sticker?: Child };

export const Photo = ({ photo, sticker }: PhotoProps) => (
	<figure class="sc-photo">
		<div class="sc-photo__frame">
			<img
				src={photoUrl(photo, "small")}
				srcset={`${photoUrl(photo, "small")} 800w, ${photoUrl(photo)} 1600w`}
				sizes="(min-width: 800px) 40vw, 100vw"
				alt={photo.alt}
				width={photo.width}
				height={photo.height}
				loading="lazy"
			/>
			{sticker && (
				<span class="sc-photo__sticker">
					<Sticker>{sticker}</Sticker>
				</span>
			)}
		</div>
		{photo.credit && (
			<figcaption class="sc-photo__credit">{photo.credit}</figcaption>
		)}
	</figure>
);

export type PhotoGridProps = { photos: PhotoData[]; feature?: boolean };

// Flush tiles cropped to 4:3, each linking to the full-size image; no client JavaScript.
export const PhotoGrid = ({ photos, feature = true }: PhotoGridProps) => (
	<ul class={feature ? "sc-grid sc-grid--feature" : "sc-grid"}>
		{photos.map((photo) => (
			<li class="sc-grid__item">
				<a class="sc-grid__link" href={photoUrl(photo)}>
					<img
						src={photoUrl(photo, "small")}
						alt={photo.alt}
						width={photo.width}
						height={photo.height}
						loading="lazy"
					/>
				</a>
			</li>
		))}
	</ul>
);
