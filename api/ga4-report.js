const { BetaAnalyticsDataClient } = require('@google-analytics/data');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Auth check
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.GA4_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { propertyId, serviceAccountJson, dateRange } = req.body;

  // Sanitize dateRange — must be NdaysAgo, yesterday, today, or YYYY-MM-DD
  const sanitizedRange = !dateRange
    ? '30daysAgo'
    : dateRange.includes('daysAgo') || dateRange === 'yesterday' || dateRange === 'today' || /^\d{4}-\d{2}-\d{2}$/.test(dateRange)
      ? dateRange
      : `${dateRange}daysAgo`;

  if (!propertyId || !serviceAccountJson) {
    return res.status(400).json({ error: 'Missing propertyId or serviceAccountJson' });
  }

  try {
    // Parse service account credentials
    const credentials = typeof serviceAccountJson === 'string'
      ? JSON.parse(serviceAccountJson)
      : serviceAccountJson;

    const analyticsClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
    });

    const property = `properties/${propertyId}`;

    // Run all reports in parallel
    const [
      overviewResponse,
      topPagesResponse,
      trafficSourcesResponse,
      dailySessionsResponse,
    ] = await Promise.all([
      // Overview metrics
      analyticsClient.runReport({
        property,
        dateRanges: [{ startDate: sanitizedRange, endDate: 'today' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
        ],
      }),

      // Top pages
      analyticsClient.runReport({
        property,
        dateRanges: [{ startDate: sanitizedRange, endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),

      // Traffic sources
      analyticsClient.runReport({
        property,
        dateRanges: [{ startDate: sanitizedRange, endDate: 'today' }],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      }),

      // Daily sessions (for chart)
      analyticsClient.runReport({
        property,
        dateRanges: [{ startDate: sanitizedRange, endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),
    ]);

    // Parse overview
    const overviewRow = overviewResponse[0]?.rows?.[0];
    const overview = overviewRow ? {
      activeUsers: overviewRow.metricValues[0].value,
      sessions: overviewRow.metricValues[1].value,
      pageViews: overviewRow.metricValues[2].value,
      bounceRate: (parseFloat(overviewRow.metricValues[3].value) * 100).toFixed(1) + '%',
      avgSessionDuration: Math.round(parseFloat(overviewRow.metricValues[4].value)) + 's',
    } : {};

    // Parse top pages
    const topPages = (topPagesResponse[0]?.rows || []).map(row => ({
      page: row.dimensionValues[0].value,
      pageViews: row.metricValues[0].value,
      users: row.metricValues[1].value,
    }));

    // Parse traffic sources
    const trafficSources = (trafficSourcesResponse[0]?.rows || []).map(row => ({
      channel: row.dimensionValues[0].value,
      sessions: row.metricValues[0].value,
    }));

    // Parse daily sessions
    const dailySessions = (dailySessionsResponse[0]?.rows || []).map(row => ({
      date: row.dimensionValues[0].value,
      sessions: row.metricValues[0].value,
      users: row.metricValues[1].value,
    }));

    return res.status(200).json({
      success: true,
      data: { overview, topPages, trafficSources, dailySessions },
      fetchedAt: new Date().toISOString(),
    });

  } catch (err) {
    console.error('GA4 API Error:', err.message);
    return res.status(500).json({
      error: 'Failed to fetch GA4 data',
      details: err.message,
    });
  }
};
