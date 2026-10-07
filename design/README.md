Scarletts play ska and other music you can dance to, out of Bristol. The look borrows from two places: 2 Tone and punk (black and white checkerboards, photocopied flyers, hard edges) and Jamaican sound-system posters (hand-painted wood type, red, gold and green). Scarlet leads; everything else backs it up.

## Content fundamentals

- Write like the band talks at the merch table: short, warm, a bit cheeky. "We" for the band, "you" for the reader.
- Headlines in `display`, `headline` and `button` are uppercase. Running text is sentence case.
- Say the useful thing first: date, venue, price. "SAT 14 NOV, venue, £8" before any description.
- British English. No emoji.

## Colour

- Pages sit on `paper` with `ink` text. Scarlet is the loudest thing on every page: one `scarlet` block per screen (hero, nav bar or a date stamp), with `on-scarlet` text on it.
- Use `scarlet-ink`, not `scarlet`, for links and any red text under 24px.
- `gold` and `green` are accents, never backgrounds for a whole section. `gold` takes `on-gold` text; `green` takes `on-green` text.
- The red, gold and green tricolour band (equal strips, `space-2` tall) can mark the top or bottom of a page. Use it once per page at most.
- Night is the dark theme for the whole site, not a separate brand; the same rules apply.
- `ink` and `paper` swap places in Night, so never use `ink` as a panel background. Page headers, the footer and photo backdrops use `night` with `on-night` text, which stay dark in both themes.

## Type

- `display` (Anton) for the band name and one hero line; `headline` for page titles; `title` for sections.
- `body` (Archivo) for all running text; `body-small` for captions and footers.
- `stamp` (Special Elite) for single typewritten lines: dates, kickers, photo credits.
- Load the three families from Google Fonts: Anton 400, Archivo 400 and 800, Special Elite 400.

## Rough edges, readable words

The site should look like a flyer glued to a venue wall, but every word must read at a glance. The rule: the frame is rough, the text is clean.

- Tight: colour blocks, photos and the checkerboard butt up against each other flush, with no gaps and no overlaps, in a square-cut grid. They can bleed off the page edge, like a poster trimmed to the edge.
- Rough: only the small things sit at an angle. `tape` labels take `tilt-left` or `tilt-right`; round `radius-pill` stickers take `tilt-sticker`. They can sit on the corner of a block or photo.
- Clean: body text, links, buttons and forms are never tilted, never covered, never over the checkerboard or the `halftone` texture, and always on a flat `paper`, `scarlet`, `gold` or `ink` ground.
- Use cut-out `tape` labels for kickers and status ("TONIGHT", "SOLD OUT"): `paper` on `ink`, or `on-scarlet` on `scarlet`. One to three words, one or two per screen.
- Headlines in `display` and `headline` can be knocked out of a `scarlet` or `ink` strip, but stay upright.
- No distressed or grunge fonts and no texture on letterforms; the grit comes from layout, not type.

## Shape and surface

- Square corners (`radius-none`) everywhere. `radius-pill` is only for round stickers and badges.
- Borders are `border-hard` solid `ink`. Shadows are `shadow-offset` only: hard, unblurred, offset down and right. Pressed buttons drop to `shadow-press`.
- The `halftone` dot texture can sit over `scarlet` blocks and the edges of photos for a photocopied look.
- Space with `space-1`, `space-2`, `space-4` and `space-8`; sections are `space-8` apart.

## The checkerboard

The 2 Tone checkerboard is the band's pattern: `ink` and `paper` squares at `space-8`. Use it as a strip along a page edge, behind the footer, or in the corner of a block. Never behind text.

## Photos

Band phone photos, cropped tight. Push them to high-contrast black and white, like a photocopy, and pair each with one `scarlet` block; that reads as 2 Tone. Photos are square cut with a `border-hard` frame, upright, and sit flush in the grid.

## Logo and icons

There is no logo yet. Set the name as SCARLETTS in `display`, uppercase, in `ink` or `on-scarlet`. There is no icon set yet; use plain text links ("Instagram", "Bandcamp") until there is.
