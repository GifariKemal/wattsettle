# 📁 Project Structure

This document defines where files belong so the repository stays readable.

## 🧭 Top Level

| Folder or file | Owner | Purpose |
|---|---|---|
| `.github/workflows` | CI | GitHub Actions workflow |
| `docs` | Documentation | Architecture, QA, release, and operational docs |
| `public` | Static hosting | Icons, OG image, robots, headers, security contact |
| `reports/qa` | QA output | Generated reports and screenshots |
| `src` | Product code | Astro app, React islands, content, styles |
| `tests/e2e` | QA code | Playwright test harness |
| `astro.config.mjs` | App config | Astro site and integrations |
| `vercel.json` | Hosting config | Vercel security headers |

## 🧩 Source Layout

| Path | Rule |
|---|---|
| `src/content` | Text, scores, route labels, and product facts |
| `src/components/sections` | Route level slide components |
| `src/components/islands` | Hydrated React widgets only |
| `src/components/ui` | Shared Astro UI primitives |
| `src/lib` | Browser utilities and integration glue |
| `src/pages` | Astro routes and generated sitemap |
| `src/styles` | Global tokens and layout CSS |

## 🧪 Test Layout

| Path | Rule |
|---|---|
| `tests/e2e/qa-e2e.mjs` | Browser checks |
| `tests/e2e/run-qa.mjs` | Static server with production headers |
| `reports/qa/qa-report.json` | Machine readable latest run |
| `reports/qa/screenshots` | Visual proof artifacts |

## 🧹 Cleanup Rules

| Rule | Reason |
|---|---|
| Keep generated QA output under `reports` | Avoid mixing test source and artifacts |
| Keep test source under `tests` | Makes npm scripts and CI obvious |
| Keep docs under `docs` or root GitHub docs | Keeps README short |
| Do not put production secrets in repo | Frontend bundles are public |
| Do not commit temporary server logs | Logs are reproducible and noisy |

## ✅ Naming Rules

| Type | Format | Example |
|---|---|---|
| Markdown docs | kebab case | `release-checklist.md` |
| Components | PascalCase | `PageShell.astro` |
| React islands | PascalCase | `Simulator.tsx` |
| Utility modules | camelCase | `themeInit.ts` |
| Generated reports | kebab case or JSON | `qa-report.json` |
