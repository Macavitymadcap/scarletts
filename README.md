# Scarletts

The website for Scarletts, a ska band from Bristol, at
<https://scarletts.uk>.

The site is static. Pages are written as JSX components and rendered to
plain HTML at build time by Bun, so visitors receive no JavaScript. It is
served by a Cloudflare Worker with static assets, and photos and audio are
served from the `scarletts-media` R2 bucket at `media.scarletts.uk`.

## Commands

| Command | What it does |
| ------- | ------------ |
| `bun install` | Installs dependencies |
| `bun run build` | Renders the site into `dist/` |
| `bun run dev` | Builds, then serves `dist/` locally as Cloudflare would |
| `bun run deploy` | Builds and deploys to Cloudflare |
| `bun test` | Runs the tests |
| `bun run typecheck` | Type-checks without emitting |
| `bun run photos:prepare` | Prepares photos in `media/originals/` for the site |
| `bun run photos:upload` | Uploads `media/out/` to the R2 bucket |

Run `bunx wrangler login` once before deploying or uploading.

## Structure

| Path | Contents |
| ---- | -------- |
| `src/site.ts` | Band name, pitch, bookings address, navigation and social links |
| `src/content/` | Typed content: bio, photos, gigs, and the media base URL |
| `src/components/` | Layout and design system components |
| `src/pages/` | One component per page |
| `src/styles/` | Design tokens, component styles and page styles |
| `src/build.tsx` | Renders every page into `dist/` |
| `scripts/` | Photo preparation and media upload |
| `public/` | Files copied into `dist/` unchanged |

The styles come from the Scarletts design system. `tokens.css` holds the
colours, type, spacing and shadows for both themes: Paper (light) and Night
(dark), which follows the visitor's system setting.

## Editing content

### Bio and line-up

Edit `src/content/bio.ts`. The first member listed gets the scarlet tile.

### Social links

Uncomment or add entries in `socials` in `src/site.ts`. The footer only
shows links that are listed.

### Gigs

Add entries to `gigs` in `src/content/gigs.ts`. The home page shows the next
upcoming gig; past gigs drop off at build time, so redeploy after each gig.

### Photos

1. Put originals in `media/originals/gigs/` or `media/originals/band/`.
2. Run `bun run photos:prepare`. It turns each photo upright, strips all
   metadata (including GPS location), and writes 1600 px and 800 px WebP
   versions to `media/out/`.
3. Paste the printed entries into `photos` in `src/content/photos.ts` and
   replace each `alt: "TODO"` with a description of the photo. Add
   `lead: true` to the photo the home page should feature.
4. Run `bun run photos:upload`, then `bun run deploy`.

The site turns photos black and white with CSS, so upload them in colour.
