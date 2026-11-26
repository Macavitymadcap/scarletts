# GigCard

One gig: a `scarlet` date block flush against a `paper` panel with the venue, city, details and an action.

- Pass `weekday`, `day` and `month` already formatted ("Sat", 14, "Nov"), plus `venue`, `city` and optional `details` ("Doors 8pm. £8 on the door."). Pass the ISO `date` too, so the date block is a `<time>` machines can read.
- The action comes from `ticket` and `eventHref`: an `on-sale` ticket shows a primary "Get tickets" button to `ticket.href`; a `sold-out` ticket shows a "Sold out" `Tape` instead; with no ticket, `eventHref` shows an "Event page" button. With neither, there is no action.
- Stack cards in a single column with `space-4` between them; date, venue, price come first, as the README's content rules say.
