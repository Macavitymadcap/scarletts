// Media lives in the R2 bucket behind media.scarletts.uk. Override at build
// time (MEDIA_BASE_URL=http://localhost:8788 bun run build) to test locally.
export const MEDIA_BASE_URL = (
	process.env.MEDIA_BASE_URL ?? "https://media.scarletts.uk"
).replace(/\/$/, "");

export const media = (key: string): string =>
	`${MEDIA_BASE_URL}/${key.replace(/^\//, "")}`;
