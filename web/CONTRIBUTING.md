# 🤝 Contributing

Thanks for helping keep WattSettle sharp. This repository is focused on a hackathon pitch website, so changes should protect clarity, demo stability, and production readiness.

## ✅ Contribution Rules

| Rule | Why |
|---|---|
| Keep content sourced | Prevent unsupported claims |
| Keep UI dense and readable | Deck must work in a live pitch |
| Keep test source under `tests` | Maintains clean architecture |
| Keep generated output under `reports` | Avoids mixing source and artifacts |
| Run QA before handoff | Prevents route, visual, and CSP regressions |

## 🧪 Required Checks

```bash
npm run security:audit
npm run test:qa
```

## 📁 Where To Change Things

| Change type | Path |
|---|---|
| Pitch copy | `src/content` |
| Route order | `src/content/nav.ts` |
| Slide layout | `src/components/sections` |
| Interactive widget | `src/components/islands` |
| Browser utility | `src/lib` |
| Security headers | Header file in `public` and `vercel.json` |
| QA logic | `tests/e2e` |
| Docs | `docs` |

## 🧭 Pull Request Checklist

- [ ] The change has one clear purpose.
- [ ] `npm run security:audit` passes.
- [ ] `npm run test:qa` passes.
- [ ] Screenshots in `reports/qa/screenshots` still look correct.
- [ ] Markdown files avoid em dash and en dash characters.
- [ ] Copyright and proprietary notice remain intact.

## 🙂 Style Notes

Use direct language. Prefer tables and checklists when they make review faster. Keep code comments short and focused on why a decision exists.
