# ajaymekala.com

The personal site for Ajay Mekala, AI/ML Engineer at Walmart. It replaces a
resume link in job applications and sits in a LinkedIn header, so it is built
for three readers in this order: a recruiter on a phone with eight seconds, an
ML lead who scrolls for ninety, and a staff engineer who opens dev tools.

Single page at `/`, four case study routes, a plain crawlable resume, and an
MDX writing section.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build        # production build
npm start            # serve the build
npm run typecheck    # tsc --noEmit, strict, noUncheckedIndexedAccess
npm run lint         # eslint, flat config
npm test             # Playwright, three viewports
npm run lighthouse   # mobile audit against a running build, writes lighthouse/
npm run analyze      # bundle analyser
```

## Where the content lives

Every word and number on the site comes from `src/content`. No copy is
hard-coded in a component, so changing a metric is a one line edit in one file.

| File                          | What it holds                                           |
| ----------------------------- | ------------------------------------------------------- |
| `src/content/site.ts`         | Identity, links, nav, hero copy, trust bar, contact     |
| `src/content/about.ts`        | The three profile paragraphs and the specification card |
| `src/content/metrics.ts`      | Hero and evaluation metric strips                       |
| `src/content/case-studies.ts` | The four systems, including the full narrative          |
| `src/content/platform.ts`     | Diagram geometry and the seven stage captions           |
| `src/content/evaluation.ts`   | The three rating comparisons and the client list        |
| `src/content/experience.ts`   | Roles, bullets, tech tags, education                    |
| `src/content/capabilities.ts` | The capability matrix with depth markers                |
| `src/content/writing.ts`      | Planned post titles for the empty state                 |
| `content/posts/*.mdx`         | Long form posts. `draft: true` keeps one off the index  |

`src/content/schema.ts` holds the Zod schemas. `src/content/validate.ts` runs
them, is marked `server-only`, and is imported from the root layout, so a bad
metric or a missing case study field fails `next build` while Zod itself never
reaches the browser.

### Publishing a post

Drop an `.mdx` file in `content/posts` with `title`, `description`, `date` and
`draft` frontmatter. Set `draft: false` and it appears on `/writing` and in the
sitemap. Both drafts already in the repo are complete; flipping the flag
publishes them.

### Replacing the resume PDF

`public/Ajay-Mekala-AI-ML-Engineer-Resume.pdf` is generated from `/resume`, so
the page a crawler reads and the file a recruiter downloads cannot drift:

```bash
npm run build && npm start
npm run resume:pdf
```

To ship a hand-designed resume instead, drop it at the same path and skip that
script. The contact section reads the real file size at build time either way.

## Deploying

**Vercel** is the default target. Import the repo, set
`NEXT_PUBLIC_SITE_URL` to the production origin, and deploy. Analytics and
Speed Insights turn themselves on only when `VERCEL_ENV` is present, so local
and self-hosted builds stay free of the two requests that would otherwise 404.

**GitHub Pages** and any other static host work through the export target:

```bash
NEXT_PUBLIC_SITE_URL=https://mekala27-45.github.io npm run export
# serves from ./out
```

The export disables image optimization and the analytics components. Every
route, including the Open Graph images, the sitemap and `robots.txt`, is
statically generated.

## Architecture notes

- **Server first.** `"use client"` sits on the smallest leaves that need it.
  The nav, the hero controls, the rating widget, the capability matrix and the
  pinned sequence are client components; everything else renders on the server.
- **Nothing is hidden without JavaScript.** Scroll reveals start visible and
  only take their hidden state once the blocking head script adds `html.js`,
  so a page with JavaScript disabled reads in full. There is a test for it.
- **One shared observer** marks every `[data-reveal]` element once and then
  stops watching it. Content never re-animates on the way back up.
- **Scroll libraries load on intent.** Lenis, GSAP and ScrollTrigger are
  imported on the first wheel, touch or key press rather than at hydration, so
  none of them is fetched or executed during the initial load. Motion's feature
  bundle follows the same rule.
- **The WebGL field is optional by design.** A 40,000 point curl noise flow in
  OGL, dynamically imported after first paint, capped at 1.5x device pixel
  ratio and 30fps. Devices reporting fewer than four cores, devices without
  WebGL, and anyone with reduced motion set get a gradient mesh that is meant
  to look like the design rather than like a failure.
- **Counters write to the DOM, not through React.** A 1.4 second tick across
  four cells would otherwise be several hundred renders during hydration.

## Performance budget

Measured with `npm run lighthouse` against a production build on a mobile
emulation, five runs:

| Metric                   | Budget       | Measured            |
| ------------------------ | ------------ | ------------------- |
| Performance              | 95           | 89 median, 85 to 91 |
| Accessibility            | 100          | 100                 |
| Best Practices           | 100          | 100                 |
| SEO                      | 100          | 100                 |
| First Contentful Paint   |              | 0.9 s               |
| Largest Contentful Paint | under 1.8 s  | 2.4 s to 2.9 s      |
| Cumulative Layout Shift  | under 0.02   | 0                   |
| Speed Index              |              | 1.0 s               |
| First load JS for `/`    | under 180 KB | 156 KB gzipped      |
| Total page weight        | under 1.2 MB | 359 KB              |

Accessibility, best practices, SEO, layout stability and bundle size all clear
the budget. Performance sits under it, and the gap is entirely the simulated
largest contentful paint. Lighthouse models a 1.5 Mbps link with a 4x CPU
slowdown, and on that model the cost is the bytes the chosen stack puts on the
critical path: React plus the app shell, and three self-hosted variable faces.

The two levers that would close it, both of which trade something the brief
asked for:

1. Drop Motion from the initial view. The shared layout animation on the nav
   indicator is the only thing in the first load that needs the projection
   engine. Replacing it with a CSS transform indicator removes roughly 26 KB.
2. Drop to two type families, or set the body face to `font-display: optional`.
   Three preloaded variable faces are 84 KB on the critical path.

Both were left in place because the brief specified them. The report is
committed at `lighthouse/report.html`.

## Verification log

Every check below was run against a production build and is reproducible with
the commands above.

| Check                            | Result                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tab order on `/`                 | 42 elements reached, 0 unreachable, 0 without a visible focus ring                                                                                     |
| JavaScript disabled              | 1,475 words readable, 0 hidden reveals, counters at final values                                                                                       |
| `prefers-reduced-motion: reduce` | 0 animations over 200ms at six scroll positions, Lenis never starts, the pinned sequence falls back to the stepper, the field renders one static frame |
| 200 percent zoom                 | No horizontal overflow, no clipped text                                                                                                                |
| Hero at 390, 834 and 1440        | No bad wraps, metric strip reads two by two under 768px                                                                                                |
| Open Graph cards                 | Five cards at exactly 1200 by 630, each naming the person                                                                                              |
| Em dashes and en dashes          | None in copy, code comments, metadata or alt text                                                                                                      |

## Accessibility

Verified with axe across both themes, two viewport widths, five routes, and
with the capability filter and the rating widget in their interacted states.
Zero violations. Plus:

- Keyboard complete, with a 2px accent `:focus-visible` ring at 2px offset.
- A skip link, semantic landmarks, and one `h1` per page.
- Contrast: every text pair clears 4.5:1 in both themes and every interactive
  border clears 3:1. Interactive boundaries use a separate `--edge-control`
  token so decorative hairlines can stay quiet without failing the check.
- `prefers-reduced-motion: reduce` disables Lenis, renders one static WebGL
  frame, prints final counter values, and collapses reveals to a 150ms fade.
- No tap target under 44px, and no horizontal scrolling at any width.

## Tests

```bash
npm test                 # 111 tests across 390, 834 and 1440
npm run test:update      # refresh visual snapshots
```

CI runs the smoke and accessibility suites only. The visual baselines are
rendered on one machine, and font rasterisation differs enough between machines
that pixel comparison is a local tool rather than a gate. Run `npm run
test:update` once after cloning to generate them.

`tests/smoke.spec.ts` covers every route, the command palette, the rating
widget, the capability filter, the resume download, the Open Graph card, the
sitemap and console noise. `tests/accessibility.spec.ts` covers axe, focus
order, heading order, the JavaScript-disabled path, reduced motion and 200
percent zoom. `tests/visual.spec.ts` holds the screenshot baselines, taken on
the gradient fallback so they are deterministic.

## Stack

Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS v4 with
CSS-first `@theme` tokens in OKLCH, Motion, GSAP ScrollTrigger for the one
pinned sequence, Lenis, OGL for the particle field, cmdk, Shiki, Zod,
Playwright, axe.

OGL rather than react-three-fiber: the hero needs one points mesh with a custom
shader, and OGL does that in about 35 KB against roughly 180 KB for three.js
plus the React renderer. The brief allows the swap where the bundle budget is
tight, and this is where it was tight.
