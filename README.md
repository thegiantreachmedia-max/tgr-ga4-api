# TGR GA4 API

GA4 Data API proxy for The Giant Reach Base44 apps.

## Setup

### 1. Deploy to Vercel
- Push this repo to GitHub
- Connect to Vercel → Add New Project → import the repo
- Vercel auto-detects the `/api` folder

### 2. Add Environment Variable in Vercel
In your Vercel project → Settings → Environment Variables:
- Key: `GA4_SECRET_KEY`
- Value: any strong secret string you choose (save this — you'll need it in Base44)

### 3. Get your Vercel URL
After deploy, Vercel gives you a URL like: `https://tgr-ga4-api.vercel.app`

Your endpoint will be: `https://tgr-ga4-api.vercel.app/api/ga4-report`

---

## How to call the endpoint (for Base44)

**Method:** POST  
**URL:** `https://your-project.vercel.app/api/ga4-report`  
**Headers:**
```
Content-Type: application/json
x-api-key: YOUR_GA4_SECRET_KEY
```

**Body:**
```json
{
  "propertyId": "535250616",
  "serviceAccountJson": { ...your service account JSON object... },
  "dateRange": "30daysAgo"
}
```

**dateRange options:** `7daysAgo`, `30daysAgo`, `90daysAgo`

---

## Response
```json
{
  "success": true,
  "fetchedAt": "2026-07-01T05:00:00.000Z",
  "data": {
    "overview": {
      "activeUsers": "1234",
      "sessions": "2345",
      "pageViews": "5678",
      "bounceRate": "42.3%",
      "avgSessionDuration": "95s"
    },
    "topPages": [...],
    "trafficSources": [...],
    "dailySessions": [...]
  }
}
```
