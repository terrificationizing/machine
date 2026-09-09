# The Decision Machine

A one-page dumb website built with Vite. Ask it a yes-or-no question, it decides your fate.

## Run it

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # preview the production build
```

## Deploy

Hosted on Cloudflare Workers. Pushing to `main` triggers a build there
(`npm run build` then `wrangler deploy`, configured by `wrangler.jsonc`).

To deploy manually:

```bash
npm run deploy
```
