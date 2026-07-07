# 🔐 Security Policy

## Supported Surface

| Area | Status |
|---|---|
| Static website | Supported |
| Browser interactivity | Supported |
| Smart contracts outside this repo | Not covered here |
| Private infrastructure | Not covered here |

## 🛡️ Current Controls

| Control | Implementation |
|---|---|
| CSP | Header file in `public`, `vercel.json` |
| Clickjacking defense | `frame-ancestors 'none'`, `X-Frame-Options: DENY` |
| MIME hardening | `X-Content-Type-Options: nosniff` |
| Permissions policy | Camera, microphone, geolocation, payment, and USB disabled |
| Referrer policy | `strict-origin-when-cross-origin` |
| Dependency audit | `npm run security:audit` |
| E2E header test | `npm run test:qa` applies the built header file |

## 📣 Report A Vulnerability

Email:

```txt
security@suriota.id
```

Please include:

| Field | Detail |
|---|---|
| Impact | What can be exploited |
| Steps | Clear reproduction steps |
| URL or file | Affected page or source file |
| Browser | Browser and version |
| Evidence | Screenshot, console message, or proof of concept |

## ⏱️ Response Target

| Severity | Target response |
|---|---|
| Critical | 24 hours |
| High | 48 hours |
| Medium | 5 business days |
| Low | Best effort |

## 🚫 Out Of Scope

| Item | Reason |
|---|---|
| Social engineering | Not a code vulnerability |
| Denial of service against local dev | Not production hosted |
| Issues requiring stolen credentials | Not actionable without credential compromise |
| Generic missing HSTS report | HSTS requires final production host policy |
