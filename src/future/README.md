# src/future — parked multi-page scaffold

**Nothing in this directory is reachable from `src/main.jsx`. It does not ship.**

Vite builds from the entry graph, so these files are tree-shaken out entirely —
they cost zero runtime bytes. They are kept deliberately, not by accident.

## What this is

An alternative **multi-page** version of the site (React Router, one route per
section) that was scaffolded early on. The site that actually ships is the
**single-page** build: `main.jsx → src/App.jsx → src/components/*.jsx`.

```
future/
  app/          router shell, routes, providers
  pages/        Home, About, Services, Projects, Team, Clients, Video, Contact
  components/   nested component library (common, layout, sections,
                portfolio, ui) — the pages depend on these
  data/         content modules (site, services, projects, team, …)
  utils/        helpers
  assets/       asset path map
  styles/       variables.css, typography.css, animations.css
                (the original token/animation sheets, superseded by
                 src/styles/tokens.css for the live site)
```

## Why it was moved here

Previously this lived alongside the live code, which meant `src/components/`
contained **two** `Services.jsx`, two `About.jsx`, two `Footer.jsx` — one live,
one dead — with no way to tell them apart. Moving the whole cluster into one
clearly-named directory removes that ambiguity without deleting work.

Note it had to move as a **single unit**: `pages/` imports from
`components/sections/` and `components/layout/`, which in turn import from
`components/{common,ui,portfolio}`, `data/` and `utils/helpers`. Deleting any
one part would have broken the rest.

## If you revive it

- Alias imports were rewritten from `@/…` to `@/future/…` (98 of them) so the
  cluster still resolves. Rewrite them back if you promote it out of here.
- `react-router-dom` is kept in `dependencies` solely for this scaffold.
- Its components are styled with the *original* design language, not the
  camera/lens system the live site now uses (see `DESIGN-PLAN.md`). Reviving it
  means restyling, not just re-routing.
