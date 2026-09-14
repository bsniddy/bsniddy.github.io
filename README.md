# Portfolio

A hand-built static site. No framework, no build step, no dependencies.
Open `index.html` and it runs. Live at **bsniddy.github.io**.

```
portfolio/
├── index.html          page shell (header, list container, overlay)
├── css/style.css       the whole design
├── js/projects.js      ← ALL CONTENT LIVES HERE
├── js/main.js          builds the list, handles the larger view
└── assets/
    ├── favicon.svg
    ├── doc/            résumé PDF
    ├── qr/             QR codes pointing at the live site
    └── work/           project imagery
```

## Design

Minimal on purpose. White background, black text, one column, hairline rules.
No accent color, no animation beyond a hover tint and a slow image scale.

The page is a header and then a list. Each row is **image on the left,
description on the right**. Clicking a row opens that project full screen with
the picture at full width, the complete Problem / Approach / Result write-up,
and the rest of its gallery underneath. `Esc` or the Close button returns you
to the list.

Everything else the site used to carry (hero canvas, ticker, stat counters,
category filters, custom cursor) is gone.

## Editing content

Everything is in **`js/projects.js`**. Order in that array is the order on the
page. To add a project, copy a block:

```js
{
  id: 'my-project',                 // unique. also the deep link (#my-project)
  title: 'Project Name',
  subtitle: 'One line, shown in the larger view',
  org: 'Where', role: 'What you did', period: 'Mon YYYY to Mon YYYY',
  tags: ['EMBEDDED', 'FIRMWARE'],
  cover: 'assets/work/shot.jpg',    // omit for no picture
  blurb: 'One or two sentences, shown in the list.',
  stack: ['C', 'Python'],
  body: [ { h: 'Problem', p: '…' }, { h: 'Approach', p: '…' }, { h: 'Result', p: '…' } ],
  gallery: [ { src: 'assets/work/a.jpg', cap: 'Caption.' } ],
  link: { href: 'https://…', label: 'site.com' },   // optional
  note: 'Optional footnote.'                        // optional
}
```

That is the only file to touch. Nothing in `main.js` needs updating.

## Projects without a picture

A row shows an image only if `cover` is a real file path. Five projects
(Digital Twin, Numerai, Personal OS, LaunchPad, CRUW) have none, so their rows
render text-only. The image column is still reserved but collapses to zero
height, which keeps every title aligned down the page without leaving a gap.

Drop a real screenshot in `assets/work/`, point `cover` at it, and the picture
appears on both the site and the PDF.

Some older fields in `projects.js` (`cat`, `accent`, and the `CATEGORIES`
array, plus any `cover: { gen: ... }` placeholders) are left over from the
previous design and are no longer read by anything. They are harmless.

## House style

No em dashes anywhere. Use a colon for an explanation or list, a semicolon
between clauses, or commas and parentheses for a parenthetical.

## Running locally

```bash
python3 -m http.server 4321 --directory ~/portfolio
```

Then open http://localhost:4321.

## Deploying

Push to `main`. GitHub Pages rebuilds in about 30 seconds.

```bash
cd ~/portfolio && git add -A && git commit -m "update" && git push
```

For a custom domain, add a `CNAME` file at the repo root containing the domain
and point DNS at GitHub Pages.

## The PDF

`~/portfolio-pdf` builds a print version from this same `projects.js`. If you
change content here, rerun `./render.sh` there so the two match.

## Notes

- Keyboard accessible: rows are real buttons, the overlay traps focus, `Esc` closes.
- Deep links work. `bsniddy.github.io/#burbio` opens that project directly.
- Respects `prefers-reduced-motion`.
- Before sharing widely: the Iridium write-up stays at résumé level, and the
  ML@Purdue charts come from that team's public-safe report. Both are worth a
  second read.
