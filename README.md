# brodysnyder.com — portfolio

A hand-built static portfolio. No framework, no build step, no dependencies.
Open `index.html` and it runs.

```
portfolio/
├── index.html          page structure
├── css/style.css       the entire design system
├── js/projects.js      ← ALL CONTENT LIVES HERE
├── js/main.js          hero canvas, grid, case studies, interactions
└── assets/
    ├── favicon.svg
    ├── doc/            résumé PDF
    └── work/           project imagery
```

## Design language — "instrument panel"

The look is pulled from your own tools rather than a template: the near-black
chassis and phosphor trace of a Joulescope capture, the blue→cyan→green→amber→red
ramp of the thermal camera in the CMSC work, and the numbered `01 //` panels from
Personal OS.

| Token | Value | Used for |
|---|---|---|
| `--void` | `#07090C` | page chassis |
| `--sig` | `#FF7A1A` | primary signal / accents |
| `--sig-warm` | `#F5C24A` | amber, name gradient |
| `--sig-ok` | `#3DDC97` | live indicators |
| `--sig-cool` / `--sig-cold` | `#22D3D8` / `#4C9DFF` | cool end of the ramp |

Monospace carries every label, number and annotation. The sans is reserved for
display type. Change `--sig` in `css/style.css` and the whole site retunes.

## Editing content

Everything is in **`js/projects.js`**. To add a project, copy a block:

```js
{
  id: 'my-project',                 // unique — also the deep link (#my-project)
  title: 'Project Name',
  subtitle: 'One line under the title',
  org: 'Where', role: 'What you did', period: 'Mon YYYY — Mon YYYY',
  cat: 'EMBEDDED',                  // must be in CATEGORIES
  tags: ['EMBEDDED', 'FIRMWARE'],
  accent: '#FF7A1A',                // this card's signal color
  cover: 'assets/work/shot.jpg',    // or { gen: 'wave' } to draw a plate
  blurb: 'One sentence for the card.',
  stack: ['C', 'Python'],
  body: [ { h: 'Problem', p: '…' }, { h: 'Approach', p: '…' }, { h: 'Result', p: '…' } ],
  gallery: [ { src: 'assets/work/a.jpg', cap: 'Caption.' } ],
  link: { href: 'https://…', label: 'site.com' },   // optional
  note: 'Optional footnote.'                        // optional
}
```

Then add its layout width to `LAYOUT` in `js/main.js` — `'wide'` (half),
`'full'` (full bleed), or `''` (third). Keep each row summing to 12 columns:
`6+6`, `4+4+4`, `12`.

No image? Use `cover: { gen: 'wave' }`. Options: `wave`, `scatter`, `grid`,
`orbit`, `bars`, `pixels`. Each is drawn deterministically from the project `id`,
so it never changes between loads.

`TIMELINE` and `STACK` at the bottom of the same file feed the About and Stack
sections.

## Running locally

```bash
python3 -m http.server 4321 --directory ~/portfolio
```

Then open http://localhost:4321.

## Deploying

Any static host works. GitHub Pages, same as White Oak:

```bash
cd ~/portfolio && git init && git add . && git commit -m "portfolio"
gh repo create brodysnyder-portfolio --public --source=. --push
```

Then enable Pages on the `main` branch in repo settings, and add a `CNAME` file
containing your domain if you point one at it.

## Before you publish — check these

- **Iridium (project 01)** — the write-up stays at the level already on your
  résumé, but you know the IP line better than I do. Read it once.
- **TSA / Kalshi (project 06)** — charts come from the team's `public/` folder
  and its explicitly public-safe report. Worth a quick word with ML@Purdue
  before it goes on a public site under your name.
- **LinkedIn URL** — `js/main.js` links to `linkedin.com/in/brody-snyder`.
  Fix it in `index.html` if that isn't your handle.
- **Phone number** — deliberately left off. It's on the résumé PDF, which is
  linked; remove that link if you'd rather it not be public.
- **Personal OS (project 08)** — no screenshot, because the dashboard renders
  your real data. There's a good one available if you want to redact it first.

## Notes

- Accessible: keyboard-navigable, focus-trapped modal, `Esc` to close, skip link,
  respects `prefers-reduced-motion` (the hero canvas renders one static frame).
- Deep links work — `…/#burbio` opens straight into that case study.
- Total page weight is about 3 MB, almost all of it project imagery.
