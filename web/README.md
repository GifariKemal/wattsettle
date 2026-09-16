# ⚡ WattSettle Web

<p align="center">
  <svg width="680" height="92" viewBox="0 0 680 92" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="WattSettle banner">
    <rect width="680" height="92" rx="18" fill="#060708"/>
    <circle cx="55" cy="46" r="22" fill="#b8ff4d"/>
    <path d="M52 20 L35 52 H52 L45 72 L74 35 H56 L64 20 Z" fill="#061006"/>
    <text x="96" y="42" fill="#f7f7ef" font-family="Arial, sans-serif" font-size="28" font-weight="700">WattSettle</text>
    <text x="96" y="66" fill="#9bb0a5" font-family="Arial, sans-serif" font-size="15">AI verified energy settlement for Web3 hackathon demo</text>
  </svg>
</p>

WattSettle is an interactive Astro deck for the Indonesia Web3 Hackathon 2026, Finance and Commerce track. It explains how signed energy readings, AI verification, and smart contract settlement can turn physical energy data into proof based payments.

> 🙂 Short version: prove the reading first, then settle the payment.

## 🧭 Quick Links

| Area | File |
|---|---|
| Architecture | [docs/architecture.md](docs/architecture.md) |
| Project structure | [docs/project-structure.md](docs/project-structure.md) |
| QA summary | [docs/qa-summary.md](docs/qa-summary.md) |
| Security | [SECURITY.md](SECURITY.md) |
| Release checklist | [docs/release-checklist.md](docs/release-checklist.md) |
| Contributing | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Copyright | [NOTICE.md](NOTICE.md) |

## ✨ Product Scope

| Item | Decision |
|---|---|
| Main build | WattSettle x Enovatek |
| Runtime | Static Astro site |
| Interactivity | React islands |
| Hosting target | `https://web3.gifariksuryo.xyz` |
| Deploy | Docker image (nginx) as an Easypanel compose service, Traefik terminates TLS |
| Production headers | Header file in `public` and `vercel.json` |
| QA command | `npm run test:qa` |

## 🧱 Stack

| Layer | Tooling | Purpose |
|---|---|---|
| Framework | Astro 7 | Static pages, routing, client transitions |
| UI islands | React 19 | Simulator, toggles, machine, SWOT board |
| Styling | Tailwind v4 plus CSS tokens | Dense pitch deck layout |
| Motion | Motion and GSAP | Count up, reveal, micro interaction |
| Icons | Phosphor, astro-icon | Offline safe icon system |
| Testing | Playwright | Route, visual, interaction, and security header checks |

## 🚀 Run Locally

```bash
npm install
npm run dev
npm run check
npm run build
npm run security:audit
npm run test:qa
```

Local dev URL:

```txt
http://127.0.0.1:4321
```

## 🚢 Deploy

The site ships as a container: Node builds the static output, nginx serves it, and Traefik
on the VPS terminates TLS in front. Security headers are generated at image build time from
`dist/_headers`, the same file the QA harness serves, so production can never drift from
what the suite asserts.

```bash
# production build behind the real nginx config, at http://127.0.0.1:8098
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
```

| Item | Value |
|---|---|
| Runtime | `nginx:alpine` serving `/usr/share/nginx/html` |
| Host | Easypanel compose service on the SURIOTA VPS |
| Domain | `https://web3.gifariksuryo.xyz` |
| Health probe | `GET /healthz` returns `204` |

## 🗺️ Site Map

| Route | Purpose |
|---|---|
| `/` | Opening thesis and live on-chain state |
| `/cara-kerja` | Signed reading, AI assessment, contract settlement |
| `/demo` | Approve and reject settlement demo |
| `/enovatek` | Cooling as a Service use case |
| `/teknologi` | Contract, AI verifier, BNB Chain, token |
| `/roadmap` | Current position and product direction |
| `/tentang` | SURIOTA and contact |

Full route list is defined in `src/content/nav.ts`.

## 🔐 Production Hardening

| Control | Status |
|---|---|
| CSP | Enforced in QA through the built header file |
| Script policy | No `unsafe-inline`, no `unsafe-eval`, SHA-256 hashes for Astro bootstrap |
| Frame protection | `frame-ancestors 'none'` plus `X-Frame-Options: DENY` |
| MIME protection | `X-Content-Type-Options: nosniff` |
| Referrer policy | `strict-origin-when-cross-origin` |
| Permissions policy | Camera, microphone, geolocation, payment, and USB disabled |
| SEO | Canonical, Open Graph, Twitter, robots, sitemap |
| Security contact | `public/.well-known/security.txt` |

## 🧪 QA Status

Latest full validation:

| Check | Result |
|---|---|
| `npm run security:audit` | ✅ 0 vulnerabilities |
| `npm run check` | ✅ 0 errors, 0 warnings |
| `npm run build` | ✅ 7 pages plus sitemap |
| `npm run test:qa` | ✅ 7 routes, 2 viewports, 0 warnings |
| Security headers in E2E | ✅ Enforced |

Artifacts live in `reports/qa`.

## 🧩 Repository Layout

```txt
web/
  docs/                 Documentation for GitHub readers
  public/               Static public assets and hosting headers
  reports/qa/           Generated QA reports and screenshots
  src/                  Astro, React, content, styles, and utilities
  tests/e2e/            Playwright QA harness
  .github/workflows/    CI workflow
```

## 📜 Copyright

Copyright (c) 2026 PT Surya Inovasi Prioritas (SURIOTA). All rights reserved.

This repository contains proprietary pitch, product, visual, and source materials for WattSettle. See [LICENSE.md](LICENSE.md) and [NOTICE.md](NOTICE.md).
