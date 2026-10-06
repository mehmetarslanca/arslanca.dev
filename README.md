# arslanca.dev

Personal website of Mehmet Arslanca.

## Stack

- Astro
- TypeScript
- CSS
- GitHub Pages

## Development

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run verify
npm run preview
```

`npm run verify` checks the generated site after `npm run build`.

## Content

- Writing posts: `src/content/writing/`
- Product data: `src/data/projects.ts`
- Product images: `public/images/projects/`
- Page hero images: `public/images/page-heroes/`
- Shared site content: `src/data/`

## Deployment

Pushes to `main` run the GitHub Pages workflow in `.github/workflows/deploy.yml`. The workflow checks, builds, verifies, and deploys the static site automatically.

The production site is configured for [arslanca.dev](https://arslanca.dev).
