# Nav

The site header: the band name in `display` type on the left and the page links on the right, on a flat `scarlet` bar with `on-scarlet` text.

- Pass `links` as `{ label, href, current }`; the current page gets a thick underline and `aria-current="page"`.
- Focus rings on the bar use `on-scarlet`, because `focus` in Night is too close to `scarlet`.
- The links wrap under the name on phones. Keep to five links or fewer.
