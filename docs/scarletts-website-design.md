# Scarletts Website: Design Document

## Scope

This document covers the first iteration of the Scarletts website and the
groundwork for later features. Scarletts are a Bristol band playing ska and
other dance music. The site is maintained by one person (Dan), so there is no
content management system; content changes are made in the repository and
deployed.

The first iteration must:

- host audio, video and photos that play or display in the browser
- have a bio page
- live on a proper domain name

Later iterations will add a mailing list, an events calendar and other
pages. Logos and promotional material do not exist yet and are out of scope.

Cloudflare details below were checked against Cloudflare's documentation in
October 2026. Dashboard labels move around; if a menu item is not where this
document says, use the search bar at the top of the dashboard.

## Current content

| Content | Status |
| ------- | ------ |
| Photos | Band members' own mobile phone photos; the band holds the rights |
| Audio | None yet; recordings expected from a session the week after this document |
| Video | None yet |
| Bio text | To be written |
| Band email | `scarletts.band.music@gmail.com` (Google account) |

Because there is no audio yet, the site launches with the home, bio and
photos pages. The music page follows once the recordings are mixed, and the
video page once there is a first video on YouTube.

## Summary

| Concern | Choice | Cost |
| ------- | ------ | ---- |
| Domain | `scarletts.uk` via Cloudflare Registrar | About $5 to $6 a year |
| DNS | Cloudflare (required by Cloudflare Registrar) | Free |
| Pages | Cloudflare Worker with static assets | Free |
| Photos and site audio | Cloudflare R2 bucket on `media.scarletts.uk` | Free up to 10 GB |
| Video | YouTube channel under the band's Google account, embedded | Free |
| Music sales | Bandcamp artist page, embedded | Bandcamp's revenue share |
| Email address | `bookings@scarletts.uk` forwarded to the band Gmail | Free |
| Build | Bun script rendering JSX to static HTML | Free |
| Styling | Open Props and plain CSS | Free |

The only recurring cost is the domain. The .uk price was not confirmed at the
time of writing; .co.uk renews at $5.30 at Cloudflare and both are run by the
same registry, so expect a similar figure at checkout.

## How Cloudflare fits together

Cloudflare is one account containing several products that all hang off your
domain. The terms that matter for this project are below.

### Account

Your login. Everything lives under it: domains, Workers, R2 buckets. The
dashboard is at `https://dash.cloudflare.com`. Turn on two-factor
authentication under your profile before buying anything.

### Zone

Cloudflare's name for a domain it manages. Buying `scarletts.uk` through
Cloudflare Registrar creates the zone automatically. Selecting the domain on
the dashboard home page opens the zone, where DNS, Email Routing and Rules
live.

### DNS records and proxying

Each DNS record has a proxy status. An orange cloud means traffic goes
through Cloudflare's network (caching, HTTPS, rules); a grey cloud means
Cloudflare only answers the DNS lookup. For this project you will rarely edit
DNS by hand, because Workers, R2 and Email Routing each add their own
records when you connect them.

### Workers

Cloudflare's serverless platform. A Worker can be code, files, or both. This
site starts as an "assets-only" Worker: a folder of built HTML, CSS and
images uploaded to Cloudflare with no code at all. Requests to static assets
are free and unlimited, and storing them costs nothing. Code (a Worker
script) is added later for the mailing list form. Find Workers in the
dashboard sidebar under Workers & Pages (sometimes shown under Compute).

### Wrangler

Cloudflare's command-line tool. It reads `wrangler.jsonc` in the repository,
uploads the built site and configures the domain. You run it with `bunx
wrangler`; it does not need installing globally.

### R2

Cloudflare's object storage, equivalent to S3 with no charge for data
leaving it. It holds the audio and photos, because no single static asset
in a Worker may exceed 25 MiB and the Worker is limited to 20,000 files.
R2's free tier is 10 GB of storage, one million write operations and ten
million read operations a month. R2 asks for a payment method before you can
create a bucket, even when you stay within the free tier. Find it in the
sidebar under R2 Object Storage.

### Email Routing

Forwards mail sent to addresses on your domain to an existing inbox. It
cannot send mail, so replies go out from the band Gmail address.

## Architecture

```text
                     scarletts.uk
                          |
            +-------------+--------------+
            |                            |
   Worker "scarletts"            media.scarletts.uk
   static assets (dist/)          R2 bucket "scarletts-media"
   HTML, CSS, favicon             photos/*.webp, audio/*.mp3
            |
            +-- embeds --> YouTube (video), Bandcamp (music sales)
```

The pages reference media by absolute URL, for example
`https://media.scarletts.uk/photos/bio/band-01.webp`. Keeping media out of
the repository means deploys stay fast and the media can be replaced without
a rebuild.

Plain `<audio>` and `<img>` elements load cross-origin media without any CORS
configuration. CORS only becomes necessary if a script fetches media
directly, for example to draw a waveform with the Web Audio API.

## Technology stack

| Layer | Choice |
| ----- | ------ |
| Runtime and build | Bun |
| Templating | JSX via `hono/jsx`, rendered to static HTML at build time |
| Styling | Open Props and plain CSS |
| Client-side JavaScript | None in the first iteration |
| Hosting | Cloudflare Worker (assets only) and R2 |
| Deployment | Wrangler |

JSX runs only at build time. Components render to strings in a Bun script,
the output is ordinary HTML, and the browser receives no JavaScript. Shared
layout lives in one component, and lists of photos and tracks are generated
from typed data, so a missing file name fails the build instead of
producing a broken page. `hono/jsx` is the JSX runtime so the same components
work unchanged inside a Hono Worker when the first dynamic route arrives.

## Repository layout

```text
.
├── biome.json
├── bun.lock
├── design/                 Design system
├── docs/                   Documentation, like this file
├── package.json
├── public
│   ├── favicon.svg
│   └── robots.txt
├── README.md
├── scripts
│   ├── prepare-photos.ts
│   └── upload-media.ts
├── src
│   ├── build.tsx
│   ├── components
│   │   ├── Footer.tsx
│   │   ├── GigCard.tsx
│   │   ├── Layout.tsx
│   │   ├── LineUp.tsx
│   │   ├── Nav.tsx
│   │   ├── Photo.tsx
│   │   └── ui.tsx
│   ├── content
│   │   ├── bio.ts
│   │   ├── gigs.ts
│   │   ├── media.ts
│   │   └── photos.ts
│   ├── pages
│   │   ├── bio.tsx
│   │   ├── home.tsx
│   │   ├── not-found.tsx
│   │   └── photos.tsx
│   ├── site.ts             Site based information
│   └── styles
│       ├── components.css
│       ├── pages.css
│       └── tokens.css
├── test
│   ├── gigs.test.ts
│   └── pages.test.tsx
├── tsconfig.json
└── wrangler.jsonc
```

`tracks.ts`, `videos.ts`, `music.tsx` and `video.tsx` are added when there is
content for them.

### TypeScript configuration

Bun reads the JSX settings from `tsconfig.json`.

```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx",
    "module": "ESNext",
    "target": "ESNext",
    "moduleResolution": "bundler",
    "types": ["bun"]
  }
}
```

### Content as typed data

```ts
// src/content/photos.ts
export type Photo = {
  file: string; // key in the R2 bucket, e.g. "photos/bio/band-01.webp"
  alt: string;
  width: number;
  height: number;
};

export const photos: Photo[] = [
  {
    file: "photos/bio/band-01.webp",
    alt: "Scarletts on stage",
    width: 1600,
    height: 1067,
  },
];
```

Recording `width` and `height` lets the page reserve space for each image,
so the layout does not jump as photos load.

### Build script

```tsx
// src/build.tsx
import { cp, mkdir, rm } from "node:fs/promises";
import { dirname } from "node:path";
import { Home } from "./pages/index";
import { Bio } from "./pages/bio";
import { Photos } from "./pages/photos";

const pages = {
  "/": Home,
  "/bio": Bio,
  "/photos": Photos,
};

await rm("dist", { recursive: true, force: true });

for (const [route, Page] of Object.entries(pages)) {
  const outPath = route === "/" ? "dist/index.html" : `dist${route}/index.html`;
  await mkdir(dirname(outPath), { recursive: true });
  await Bun.write(outPath, `<!doctype html>${(<Page />).toString()}`);
}

await cp("public", "dist", { recursive: true });
await cp("src/styles", "dist/styles", { recursive: true });
```

### Scripts

```json
{
  "scripts": {
    "build": "bun src/build.tsx",
    "dev": "bun run build && bunx wrangler dev",
    "deploy": "bun run build && bunx wrangler deploy"
  }
}
```

`wrangler dev` serves `dist/` locally the same way Cloudflare will, including
the 404 handling and trailing-slash behaviour.

### Wrangler configuration

```jsonc
// wrangler.jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "scarletts",
  "compatibility_date": "2026-10-01",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  },
  "routes": [
    { "pattern": "scarletts.uk", "custom_domain": true }
  ]
}
```

There is no `main` entry, which makes this an assets-only Worker. The
`custom_domain` route makes Wrangler create the DNS record and HTTPS
certificate for `scarletts.uk` on deploy.

## Pages

### At launch

| Route | Content |
| ----- | ------- |
| `/` | Band name, one-line pitch, a lead photo, links to socials and email |
| `/bio` | Who the band are, line-up, Bristol, influences, a photo |
| `/photos` | Grid of the band's photos |

### After the recording session

| Route | Content |
| ----- | ------- |
| `/music` | Track list with `<audio controls preload="none">` per track, plus the Bandcamp embed |

`preload="none"` stops the browser downloading every track when the music
page opens.

### Once there is video

| Route | Content |
| ----- | ------- |
| `/video` | YouTube embeds using `youtube-nocookie.com` |

The privacy-enhanced YouTube domain avoids setting tracking cookies until a
visitor presses play.

## Media handling

### Photos

The current photos come from phones, so each one needs three things before
upload:

- Strip metadata. Phone photos usually embed GPS coordinates showing where
  they were taken, which can reveal band members' homes. Convert with a tool
  that drops EXIF data and spot-check the output with `exiftool`.
- Resize to the largest size actually displayed, around 1600 px wide for a
  full-width image. Keep the originals elsewhere.
- Convert to WebP.

A small Bun script using `sharp` does all three in one pass and can also
print the width and height for `photos.ts`. `sharp` discards metadata unless
told to keep it.

### Audio

MP3 at 192 to 256 kbps. Every browser plays it, and a four-minute track is
roughly 6 to 8 MB. Mixed masters from the recording session should be kept
elsewhere at full quality; the site only needs the MP3s.

### Bucket structure

```text
scarletts-media/
├── photos/
│   ├── bio/
│   └── gigs/
└── audio/
```

### Uploading

Small numbers of files can be dragged into the bucket in the dashboard
(R2 Object Storage, select the bucket, Upload). From the command line:

```sh
bunx wrangler r2 object put scarletts-media/photos/bio/band-01.webp \
  --file ./media/out/band-01.webp \
  --content-type image/webp \
  --remote
```

`--remote` matters: without it, recent versions of Wrangler write to a local
simulated bucket used by `wrangler dev`. Use `audio/mpeg` as the content type
for MP3s.

## Setup walkthrough

Do these once, in order.

1. [✅] Create a Cloudflare account at `https://dash.cloudflare.com/sign-up` using
   the band Gmail address, verify it (Registrar requires a verified address),
   and enable two-factor authentication. Using the band address keeps the
   domain with the band rather than with one person.
2. [✅] Register the domain. Go to Domain Registration, Register Domains,
   search for `scarletts.uk`, select Purchase, choose the term, and enter
   contact details. Contact details are redacted from public WHOIS where the
   registry allows. The zone and Cloudflare nameservers are set up for you.
3. [✅] Enable DNSSEC. Open the zone, go to DNS, Settings, and enable DNSSEC.
4. [✅] Enable R2. Go to R2 Object Storage, add a payment method when prompted,
   and create a bucket named `scarletts-media`. Avoid dots in the name.
5. [✅] Connect the media domain. In the bucket, go to Settings, Custom
   Domains, and add `media.scarletts.uk`. Leave the `r2.dev` public URL
   disabled; it is rate limited and intended for testing only.
6. [✅] Log Wrangler in. In the repository, run `bunx wrangler login`; it opens a
   browser to authorise your account.
7. [✅] Deploy. Run `bun run deploy`. The first deploy creates the Worker named
   `scarletts` and attaches `scarletts.uk`. It appears under Workers &
   Pages.
8. [✅] Redirect `www`. In the zone, go to Rules and create a redirect rule from
   `www.scarletts.uk` to `https://scarletts.uk` (Cloudflare offers a
   ready-made template for this). The rule needs a proxied DNS record for
   `www` to exist; the template prompts for one if it is missing.
9. [✅] Set up email. In the zone, go to Email Routing and select Add records and
   enable. Under Routing rules, create the custom address
   `bookings@scarletts.uk` with destination
   `scarletts.band.music@gmail.com`, then click the verification link
   Cloudflare sends to that inbox. Every bandmate with access to the Gmail
   account sees booking enquiries.
10. [✅] Add analytics. Cloudflare Web Analytics is free and does not use cookies,
    so no cookie banner is needed. It is under Analytics & Logs, Web
    Analytics.

## Later phases

### Music page and persistent player

When the recordings arrive, add `tracks.ts` and the `/music` page. At the
same point, add htmx 4 with `hx-boost` and a player outside `<main>`, so a
track keeps playing while visitors move between pages.

### Mailing list

Use a hosted provider such as Buttondown or MailerLite. They handle double
opt-in, unsubscribe links and deliverability, and holding fans' email
addresses yourself brings UK GDPR obligations that a provider already meets.

Add a Worker script with Hono that handles `POST /api/subscribe` and calls
the provider's API, keeping the API key as a Worker secret
(`bunx wrangler secret put MAILING_LIST_KEY`). The form uses htmx `hx-post`
and swaps in a confirmation message. Only `/api/*` should invoke the script;
everything else stays free static asset traffic.

### Events calendar

A typed `gigs.ts` file rendered at build time, the same way as photos.
Filtering by date at build time drops past gigs, and a scheduled GitHub
Action that rebuilds daily keeps the list current without manual deploys.

### Infrastructure as code

The domain purchase is manual. The R2 bucket, its custom domain, the `www`
redirect and Email Routing can move into the Cloudflare Terraform provider
once the setup has settled.

## Next steps

1. [✅] Create the YouTube channel and Bandcamp page to secure the names.
2. [✅] Complete setup steps 1 to 6: Cloudflare account, domain, DNSSEC, R2 and
   the media domain.
3. [✅] Scaffold the repository and deploy a placeholder home page to prove the
   pipeline end to end.
4. [] Write the bio, then strip, resize and upload the photos.
5. [✅] Build the home, bio and photos pages and launch.
6. [✅] Set up Email Routing, the `www` redirect and analytics.
7. [] After the recording session, add the music page, the persistent player
   and the Bandcamp embed.
