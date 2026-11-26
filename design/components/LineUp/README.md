# LineUp

The band line-up as flush, square-cut tiles: a square black and white portrait on top, then each member's role in `stamp` type, their name in `title` type and an optional short bio in `body-small`.

- Pass `members` as `{ name, role, bio?, photo? }` in the order the band wants them read. The first tile is `scarlet` with `on-scarlet` text; the rest are `paper` with `ink` text. A black and white portrait above the `scarlet` panel is the 2 Tone pairing.
- `photo` is `{ src, alt, width, height }`, using the 800 px version. It is cropped square to fill the tile and turned black and white like every other photo, so frame the member in the middle of the shot.
- Until a member has a portrait, their initial sits in `display` `ink` type on a `paper` block, so every tile in a row stays the same height.
- Keep bios to a sentence or two, in the band's voice: what they play and something about them. Tiles in a row stretch to the longest bio.
- Tiles butt up against each other with shared `border-hard` lines and wrap to fit the width; no gaps, no tilt.
- Use names as the band members want them shown. Roles are instruments or parts: "Vocals", "Trombone", "Bass".
