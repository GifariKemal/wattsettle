# 🚢 Release Checklist

Use this checklist before publishing or presenting the deck.

## ✅ Required Commands

| Step | Command | Expected |
|---|---|---|
| 1 | `npm run security:audit` | 0 vulnerabilities |
| 2 | `npm run check` | 0 errors and 0 warnings |
| 3 | `npm run build` | 18 pages plus sitemap |
| 4 | `npm run test:qa` | PASS with 0 warnings |

## 🔐 Security Gate

| Item | Pass condition |
|---|---|
| CSP | No browser console CSP errors |
| Script policy | No `unsafe-eval`; no broad script wildcard |
| Third party scripts | None loaded from remote CDN |
| Secrets | No private keys, passwords, tokens, or client secrets |
| Security contact | `public/.well-known/security.txt` exists |

## 🌐 SEO Gate

| Item | Pass condition |
|---|---|
| Canonical URL | Uses `https://wattsettle.suriota.id` |
| Open Graph image | Resolves to `/og.png` |
| Robots | Allows crawl and points to sitemap |
| Sitemap | Includes all deck routes |
| Page titles | Include WattSettle |

## 🎤 Demo Gate

| Flow | Pass condition |
|---|---|
| Intro | First viewport shows thesis |
| Simulator | Approve and reject paths work |
| Machine | Settlement state changes visibly |
| Benchmark | Main build and pivot are clear |
| Mobile | No horizontal overflow |

## 🧾 Release Sign Off

| Role | Required sign off |
|---|---|
| Product | Narrative and scoring are current |
| Engineering | Build and QA pass |
| Security | Audit and CSP pass |
| Founder | Demo path is ready for judging |
