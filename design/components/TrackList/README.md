# TrackList

A numbered list of tracks, each with a `scarlet` number block, the title in `title` type, an optional note, the length in `stamp` type, and the browser's own audio player underneath.

- Pass `tracks` as `{ title, src, duration, note, isNew }`; `src` is the MP3's full URL on `media.scarletts.uk`, and `duration` is pre-formatted ("3:42").
- Each player uses `preload="none"`, so nothing downloads until a visitor presses play. There is no client JavaScript.
- `isNew` adds a `scarlet` "New" `Tape` label; use it on one track at most.
- The player's controls are drawn by the browser. They take `scarlet` as their accent where the browser allows it, and follow the Paper or Night theme. Everything around them is brand.
- When the persistent player arrives with htmx, this list stays as the track index and its play buttons hand the track to that player instead.
