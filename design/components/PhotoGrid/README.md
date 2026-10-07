# PhotoGrid

A gallery of band photos as flush, square-cut 4:3 tiles with shared `border-hard` lines, each linking to the full-size image.

- Pass `photos` as `{ src, full, alt, width, height }` from `photos.ts`; `full` is the large version on `media.scarletts.uk` (defaults to `src`).
- `feature` (on by default) makes the first photo a double-size tile; put the strongest shot first.
- Photos show in high-contrast black and white and come back to colour on hover or keyboard focus, for the photocopied 2 Tone look. The originals stay in colour.
- Tiles crop to 4:3 with `object-fit: cover`, so keep faces away from the edges. No gaps, no tilt; a `Sticker` or `Tape` can sit outside the grid, never on a tile.
- Every photo needs real `alt` text saying who and what is in the shot.
