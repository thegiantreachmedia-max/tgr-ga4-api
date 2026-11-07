# SECURITY_AUDIT.md — TGR GA4 API

**Audit branch:** `security/prelaunch-audit-2026-11-07`

| ID | Severity | File | Finding | Status |
|---|---|---|---|---|
| OPS-07 | Medium | `api/ga4-report.js:5-18,27-42` | API used wildcard CORS and accepts Google service-account JSON including private_key in the request body. A static `GA4_SECRET_KEY` is the only caller authentication. | CORS restricted in branch; service-account transport and rate limiting remain open |

## Fix staged

- CORS allows only `app.thegiantreach.com`, `thegiantreach.com` and `www.thegiantreach.com`; server-to-server requests without Origin remain supported.
- Add `Cache-Control: no-store` and `X-Content-Type-Options: nosniff`.

## Required

- Confirm the caller is a trusted server, not a browser bundle. Never expose `GA4_SECRET_KEY` or service-account `private_key` to browser code.
- Prefer storing service-account credentials in Vercel environment variables or a managed secret store instead of accepting private keys in request bodies.
- Add per-key/IP rate limiting, request-size limits, strict date/property validation and audit logs that never contain credentials.
- Verify the API key is configured only in server-side Vercel environment variables and absent from Git history.
- Run dependency audit and commit a lockfile.
