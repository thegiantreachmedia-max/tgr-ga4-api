# TGR GA4 API

**A server-side Google Analytics 4 reporting API for The Giant Reach applications.**

TGR GA4 API is a lightweight integration service that retrieves website analytics from Google Analytics 4 and makes the results available through a protected HTTP endpoint. It was created as an internal utility to connect analytics data with The Giant Reach applications and dashboards.

[The Giant Reach](https://www.thegiantreach.com) · [GitHub](https://github.com/thegiantreachmedia-max)

---

## What it does

The API retrieves and organises key GA4 reporting data, including:

- **Traffic overview** — active users, sessions and page views.
- **Engagement metrics** — bounce rate and average session duration.
- **Top pages** — pages receiving the most views.
- **Traffic sources** — channels and sources bringing visitors to the website.
- **Daily sessions** — session activity over the selected reporting period.

## How it works

1. A trusted server-side application sends a request to the API.
2. The request includes the GA4 property ID, service-account credentials and requested date range.
3. The API authenticates with Google Analytics Data API.
4. The service returns a structured JSON response containing the requested metrics.

## API

**Endpoint**

```http
POST /api/ga4-report
```

**Headers**

```http
Content-Type: application/json
x-api-key: YOUR_GA4_SECRET_KEY
```

**Request body**

```json
{
  "propertyId": "YOUR_GA4_PROPERTY_ID",
  "serviceAccountJson": {
    "...": "Google service-account credentials"
  },
  "dateRange": "30daysAgo"
}
```

Supported date ranges:

- `7daysAgo`
- `30daysAgo`
- `90daysAgo`

A successful response contains a `success` status, a `fetchedAt` timestamp and a `data` object with the analytics report.

## Technology

- Node.js
- Vercel serverless functions
- Google Analytics Data API
- `@google-analytics/data`
- `google-auth-library`

## Deployment and configuration

The service is designed for deployment on Vercel.

1. Import the repository into a Vercel project.
2. Add the `GA4_SECRET_KEY` environment variable with a strong, private secret.
3. Configure the Google service-account credentials securely on the server side.
4. Ensure the service account has access to the intended GA4 property.
5. Deploy the project and call the `/api/ga4-report` endpoint from a trusted backend.

## Security

- Never commit service-account JSON, private keys, API secrets or environment files.
- Keep the API key and Google credentials on the server; never expose them in frontend code.
- Restrict access to trusted server-side callers.
- Rotate any credential that may have been exposed.

## Project purpose

TGR GA4 API is an internal integration component maintained by **[The Giant Reach](https://www.thegiantreach.com)**. It supports analytics access for connected applications; it is not presented as a standalone analytics product.

## About The Giant Reach

The Giant Reach builds client acquisition and workflow systems for businesses, with a focus on practical software that improves how teams operate.

- **Website:** https://www.thegiantreach.com
- **Portfolio:** https://www.thegiantreach.com/portfolio
- **Contact:** [opeyemi@thegiantreach.com](mailto:opeyemi@thegiantreach.com)

---

*Internal integration utility by The Giant Reach.*
