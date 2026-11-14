# TGR GA4 API

A lightweight server-side proxy for retrieving Google Analytics 4 reports for The Giant Reach applications.

> **Repository purpose:** Internal integration utility. This repository documents the API component; it is not a standalone analytics product.

## What it does

The service connects to the Google Analytics Data API and returns a structured report containing:

- Active users, sessions and page views
- Bounce rate and average session duration
- Top pages
- Traffic sources
- Daily session data

The project uses the Google Analytics Data client and Google authentication libraries.

## API endpoint

After deploying the project to Vercel, the report endpoint is:

```text
POST /api/ga4-report
```

### Request headers

```http
Content-Type: application/json
x-api-key: YOUR_GA4_SECRET_KEY
```

### Request body

```json
{
  "propertyId": "YOUR_GA4_PROPERTY_ID",
  "serviceAccountJson": {
    "...": "Google service-account credentials"
  },
  "dateRange": "30daysAgo"
}
```

Supported date ranges documented for this integration:

- `7daysAgo`
- `30daysAgo`
- `90daysAgo`

### Response

A successful response includes a `success` flag, fetch timestamp and a `data` object containing the report metrics and breakdowns.

## Deployment configuration

The original deployment setup uses Vercel.

Configure the following environment variable in the Vercel project:

| Variable | Purpose |
| --- | --- |
| `GA4_SECRET_KEY` | Shared secret used to authenticate requests to the API |

Install dependencies and deploy the repository through the connected Vercel project.

## Security

- Keep `GA4_SECRET_KEY` private and use a strong, unique value.
- Never commit Google service-account credentials, private keys or production secrets.
- Do not expose this endpoint's API key or service-account credentials in browser-side code.
- Treat this as a server-to-server integration. Restrict access and store credentials in secure server-side configuration.
- Rotate credentials immediately if they are exposed.

## Technology

- Node.js
- Vercel serverless API
- Google Analytics Data API
- `@google-analytics/data`
- `google-auth-library`

## Maintained by

**The Giant Reach**  
[thegiantreach.com](https://www.thegiantreach.com) · [GitHub](https://github.com/thegiantreachmedia-max)

---

This repository is maintained as an internal integration component. Production credentials and private application code should remain outside this public repository.
