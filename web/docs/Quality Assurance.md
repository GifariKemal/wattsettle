# 🧪 Quality Assurance

## ✅ Test Strategy

| Layer | Command | Coverage |
|---|---|---|
| Dependency audit | `npm run security:audit` | Known npm vulnerabilities |
| Type and Astro check | `npm run check` | Astro and TypeScript diagnostics |
| Static build | `npm run build` | All routes and sitemap generation |
| E2E QA | `npm run test:qa` | Routes, UI interactions, console, images, overflow, screenshots |

## 🧭 Critical Journeys

| Journey | Why it matters | Check |
|---|---|---|
| Page load for 7 routes | Product story must be navigable | Route sweep |
| Removed deck routes return 404 | Old pitch deck URLs must not linger | Negative route sweep |
| Menu open and close | Main navigation control | Keyboard and click |
| Drawer navigation on mobile | Demo may run on a phone | Open, tap, assert URL |
| Simulator approve and reject | Core product proof | Button flow and verdict |
| Settlement machine | Interactive demo credibility | Launch and reject path |
| On-chain link integrity | Rendered addresses and tx must match `src/content/site.ts` | Link comparison |
| Mobile layout | Demo may run on phone | Viewport and overflow checks |

## 📊 Latest Result

| Metric | Result |
|---|---|
| Routes checked | 7 |
| Console warnings | 0 |
| Console errors | 0 |
| Broken images | 0 |
| Horizontal overflow failures | 0 |
| Screenshots | 6 |

## 📸 Visual Artifacts

| View | Screenshot |
|---|---|
| Desktop home | `reports/qa/screenshots/desktop-home.png` |
| Desktop demo | `reports/qa/screenshots/desktop-demo.png` |
| Desktop technology | `reports/qa/screenshots/desktop-teknologi.png` |
| Mobile home | `reports/qa/screenshots/mobile-home.png` |
| Mobile demo | `reports/qa/screenshots/mobile-demo.png` |
| Mobile technology | `reports/qa/screenshots/mobile-teknologi.png` |

## 🧯 Failure Handling

| Failure | First response |
|---|---|
| CSP console error | Check the header file in `public`, `vercel.json`, and inline hash changes |
| Route 404 | Check `src/content/nav.ts` and `[...slug].astro` route mapping |
| Hydration timeout | Check island script loading and CSP |
| Horizontal overflow | Inspect latest screenshot and offending component |
| Broken image | Check `public` asset path and generated HTML |
