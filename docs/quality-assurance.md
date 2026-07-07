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
| Page load for 18 routes | Pitch must be navigable | Route sweep |
| Menu open and close | Main navigation control | Keyboard and click |
| Keyboard deck navigation | Accessibility and presenter flow | Home, End, arrows |
| Simulator approve and reject | Core product proof | Button flow and verdict |
| Option toggle | Opsi 5 and 6 clarity | Toggle content assertion |
| Settlement machine | Interactive demo credibility | Launch and reject path |
| SWOT board | Strategy explanation | Tab checks |
| Mobile layout | Demo may run on phone | Viewport and overflow checks |

## 📊 Latest Result

| Metric | Result |
|---|---|
| Routes checked | 18 |
| Console warnings | 0 |
| Console errors | 0 |
| Broken images | 0 |
| Horizontal overflow failures | 0 |
| Screenshots | 6 |

## 📸 Visual Artifacts

| View | Screenshot |
|---|---|
| Desktop home | `reports/qa/screenshots/desktop-home.png` |
| Desktop Codex | `reports/qa/screenshots/desktop-codex.png` |
| Desktop machine | `reports/qa/screenshots/desktop-mesin.png` |
| Mobile home | `reports/qa/screenshots/mobile-home.png` |
| Mobile Codex | `reports/qa/screenshots/mobile-codex.png` |
| Mobile machine | `reports/qa/screenshots/mobile-mesin.png` |

## 🧯 Failure Handling

| Failure | First response |
|---|---|
| CSP console error | Check the header file in `public`, `vercel.json`, and inline hash changes |
| Route 404 | Check `src/content/nav.ts` and `[...slug].astro` route mapping |
| Hydration timeout | Check island script loading and CSP |
| Horizontal overflow | Inspect latest screenshot and offending component |
| Broken image | Check `public` asset path and generated HTML |
