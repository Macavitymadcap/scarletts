# Scarletts

The website for Scarletts, a ska band from Bristol, at
<https://scarletts.uk>.

The public site is static. Pages are written as JSX components and rendered
to plain HTML at build time by Bun, so visitors receive no JavaScript. It is
served by a Cloudflare Worker with static assets, and photos and audio are
served from the `scarletts-media` R2 bucket at `media.scarletts.uk`.

The band also has a private shared calendar at `/crew`. A small Worker
script handles only `/crew` and `/cal`, so public pages never invoke it. See
[Crew calendar](#crew-calendar).

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
| `bun run db:migrate` | Applies `migrations/` to the remote crew database |
| `bun run db:migrate:local` | Applies `migrations/` to the local crew database |

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
| `src/worker/` | The crew calendar: Hono routes, views, D1 queries and Access checks |
| `migrations/` | D1 schema for the crew calendar |
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

## Crew calendar

`/crew` is a shared calendar for the band: gigs, rehearsals and anything
else, plus a button on each day to say you can't make it. Any member can add,
edit or delete any event, and each event shows who last changed it. It is
not linked from the public site and is marked `noindex`; Cloudflare Access is
what keeps it private.

Everything runs on Cloudflare's free tier: Access is free for up to 50
users, D1 for up to 5 GB, and the Worker script for 100,000 requests a day.

### One-off setup

1. Create the database with `bunx wrangler d1 create scarletts-crew` and put
   the printed `database_id` in `wrangler.jsonc`.
2. Run `bun run db:migrate`.
3. Add each member:

   ```sh
   bunx wrangler d1 execute scarletts-crew --remote \
     --command "INSERT INTO members (email, name) VALUES ('someone@example.com', 'Name')"
   ```

4. In the Cloudflare dashboard, open Zero Trust. Choose a team name, and
   pick the Free plan when asked.
5. Under Integrations > Identity providers, choose **Add new identity
   provider** and add **One-time PIN**.
6. Under Access > Applications, add a self-hosted application for
   `scarletts.uk` with the path `crew`. Under its login methods, make sure
   One-time PIN is ticked. Add an Allow policy with an **Emails** rule
   listing the members' addresses.
7. Copy the application's Audience (AUD) tag and your team domain
   (`<team>.cloudflareaccess.com`) into `ACCESS_AUD` and
   `ACCESS_TEAM_DOMAIN` in `wrangler.jsonc`.
8. For "Publish now", create a fine-grained GitHub token with
   **Contents: read and write** on this repository only, and run
   `bunx wrangler secret put GITHUB_TOKEN`.
9. Give the `CLOUDFLARE_API_TOKEN` used by GitHub Actions **D1: Read**
   permission, so deploys can read public gigs.

Members sign in by entering their email address and the code Cloudflare
emails them. The Worker checks the Access token itself as well, and refuses
anyone not in the `members` table.

### Calendar feeds

Under "Feed & publishing", each member can make a private `/cal/….ics` link
to subscribe to in their phone's calendar. Phone apps can't sign in to
Access, so the feed lives outside `/crew` and the long random link is the
password. Making a new link stops the old one working.

### Gigs on the public site

Tick "Show this gig on scarletts.uk" on a gig and it is added to the public
gig list at the next deploy. `bun run deploy` and the GitHub deploy job read
public gigs from D1 (`D1_GIGS=1`); a failed read stops the deploy rather
than dropping gigs. The deploy job also runs every morning and when someone
presses "Publish now". Gigs in `src/content/gigs.ts` still work and win over
a crew gig with the same date and venue.

### Local development

Copy `.dev.vars.example` to `.dev.vars` and set `DEV_EMAIL`, which signs you
in on localhost without Access. Then:

```sh
bun run db:migrate:local
bunx wrangler d1 execute scarletts-crew --local \
  --command "INSERT INTO members (email, name) VALUES ('you@example.com', 'You')"
bun run dev
```
