# GigCard

One gig: a `scarlet` date block flush against a `paper` panel with the venue, city, details and an action.

- Pass `weekday`, `day` and `month` already formatted ("Sat", 14, "Nov"), plus `venue`, `city` and optional `details` ("Doors 8pm. £8 on the door.").
- `status` picks the action: `on-sale` shows a primary "Get tickets" button when `ticketsHref` is set; `sold-out` and `free` show a `Tape` label instead.
- Stack cards in a single column with `space-4` between them; date, venue, price come first, as the README's content rules say.
