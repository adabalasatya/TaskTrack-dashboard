# Full-Stack Mixpanel Analytics Integration Guide

This document explains the complete Mixpanel analytics integration for the TaskTrack Dashboard.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│          React Frontend (Vite)                          │
│         http://localhost:5174                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │  App.jsx (Navigation: Tasks / Analytics)         │  │
│  │                                                   │  │
│  │  ├─ Dashboard.jsx (Task Management)              │  │
│  │  │  └─ useTasks() hook → taskService             │  │
│  │  │     └─ Axios → http://localhost:3000/api      │  │
│  │  │                                               │  │
│  │  └─ AnalyticsDashboard.jsx (Mixpanel Stats)      │  │
│  │     └─ useAnalytics() hook → analyticsService    │  │
│  │        └─ Axios → http://localhost:3001/api/...  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓ (Axios)
┌─────────────────────────────────────────────────────────┐
│        Node.js Express Backend                          │
│       http://localhost:3001                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  server.js (Express app with CORS)               │  │
│  │                                                   │  │
│  │  └─ /api/analytics/... (Routes)                  │  │
│  │     ├─ /events                                   │  │
│  │     ├─ /segmentation                             │  │
│  │     ├─ /top-events                               │  │
│  │     ├─ /retention                                │  │
│  │     ├─ /funnel                                   │  │
│  │     └─ /dashboard (aggregated)                   │  │
│  │                                                   │  │
│  │  ├─ MixpanelService (Mixpanel API wrapper)       │  │
│  │  │  └─ Uses MIXPANEL_API_SECRET (env)            │  │
│  │  │     └─ Basic Auth header (Base64)             │  │
│  │  │                                               │  │
│  │  └─ analyticsTransformer.js (Data formatting)    │  │
│  │     └─ Converts Mixpanel → Chart data            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓ (Axios + Auth)
┌─────────────────────────────────────────────────────────┐
│           Mixpanel API                                  │
│  https://data.mixpanel.com/api/2.0                      │
│                                                         │
│  ├─ /events (get raw events)                           │
│  ├─ /segmentation (group by properties)                │
│  ├─ /retention (user retention analysis)               │
│  ├─ /topevents (popular events)                        │
│  └─ /funnels (conversion funnels)                      │
└─────────────────────────────────────────────────────────┘
```

## Key Files

### Frontend

**Navigation & Routing:**
- `src/App.jsx` - Main app with tab navigation (Tasks/Analytics)

**Analytics Page:**
- `src/pages/AnalyticsDashboard.jsx` - Main analytics dashboard UI
- `src/services/mixpanelApiService.js` - Backend API client
- `src/hooks/useAnalytics.js` - React hooks for data fetching
  - `useAnalytics(days)` - Get dashboard data
  - `useAnalyticsEvents(eventName, days)` - Get specific events
  - `useAnalyticsSegmentation(eventName, property, days)` - Get segmentation
  - `useTopEvents(days, limit)` - Get top events

**Existing Components (Reused):**
- `src/components/StatCards.jsx` - Display metrics
- `src/charts/PieChart.jsx` - Status distribution
- `src/charts/BarChart.jsx` - Event types
- `src/charts/LineChart.jsx` - Daily activity
- `src/charts/AreaChart.jsx` - Cumulative events

### Backend

**Server:**
- `backend/server.js` - Express app with CORS, middleware, routes
- `backend/package.json` - Dependencies: express, cors, dotenv, axios, node-cache

**Services:**
- `backend/services/mixpanelService.js` - Mixpanel API wrapper
  - Handles authentication with Basic Auth (API secret)
  - Methods: `getEvents()`, `getSegmentation()`, `getRetention()`, `getFunnel()`, `getTopEvents()`

**Routes:**
- `backend/routes/analytics.js` - REST API endpoints
  - GET `/events` - Fetch raw events
  - GET `/segmentation` - Get segmentation data
  - GET `/top-events` - Get top events
  - GET `/retention` - Get retention data
  - POST `/funnel` - Get funnel data
  - GET `/dashboard` - Get complete dashboard data

**Utilities:**
- `backend/utils/analyticsTransformer.js` - Data transformation
  - `transformAnalyticsData.calculateStats()` - Calculate metrics
  - `transformAnalyticsData.formatTimelineData()` - Format for charts
  - `transformAnalyticsData.formatDailyComparison()` - Compare created vs completed
  - `transformAnalyticsData.formatStatusDistribution()` - Pie chart data
  - `transformAnalyticsData.formatEventCounts()` - Bar chart data
  - `transformAnalyticsData.formatCumulativeData()` - Area chart data

**Configuration:**
- `backend/.env` - Environment variables (Mixpanel credentials, port)
- `backend/.env.example` - Configuration template
- `.env.local` (root) - Frontend configuration

## Setup Instructions

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- `express` 4.18.2 - Web framework
- `cors` 2.8.5 - Cross-origin requests
- `dotenv` 16.3.1 - Environment variables
- `axios` 1.6.2 - HTTP client
- `node-cache` 5.1.2 - In-memory caching
- `nodemon` 3.0.1 - Auto-reload (dev)

### Step 2: Configure Environment Variables

**Backend (.env):**
```env
PORT=3001
FRONTEND_URL=http://localhost:5174
MIXPANEL_API_SECRET=713d9f569748f7a7f108c55cc00561f5
MIXPANEL_TOKEN=713d9f569748f7a7f108c55cc00561f5
CACHE_TTL=300
```

**Frontend (.env.local):**
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_ENDPOINT_TASKS=/tasks
VITE_ANALYTICS_API_URL=http://localhost:3001/api/analytics
```

### Step 3: Start Services

**In one terminal (Frontend):**
```bash
npm run dev
# Frontend runs on http://localhost:5174
```

**In another terminal (Backend):**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:3001
```

You should see output:
```
✓ Analytics server running on http://localhost:3001
✓ CORS enabled for http://localhost:5174
✓ Health check: http://localhost:3001/health
```

### Step 4: Access the Dashboard

1. Open http://localhost:5174 in your browser
2. Click the "Analytics" tab
3. You should see Mixpanel data loading

## How Data Flows

### 1. Frontend Makes Request
```javascript
// In AnalyticsDashboard.jsx
const { data, loading, error } = useAnalytics(30)
```

### 2. Hook Calls API Service
```javascript
// In useAnalytics hook
const dashboardData = await analyticsService.getDashboard(30)
```

### 3. API Service Calls Backend
```javascript
// In mixpanelApiService.js
const response = await analyticsApi.get('/dashboard', {
  params: { days: 30 }
})
```

### 4. Backend Calls Mixpanel
```javascript
// In analytics.js route handler
const createdEvents = await mixpanelService.getEvents('Task Created', 30)
```

### 5. MixpanelService Authenticates with Mixpanel API
```javascript
// In mixpanelService.js
const authHeader = this.getAuthHeader() // Base64 encode secret
const response = await axios.get('https://data.mixpanel.com/api/2.0/events', {
  headers: { 'Authorization': authHeader }
})
```

### 6. Backend Transforms Data
```javascript
// In analytics.js route
const stats = transformAnalyticsData.calculateStats(events)
const chartData = {
  statusDistribution: transformAnalyticsData.formatStatusDistribution(events),
  eventCounts: transformAnalyticsData.formatEventCounts(events),
  // ...
}
```

### 7. Frontend Receives and Displays Data
```javascript
// In AnalyticsDashboard.jsx
<div className="text-3xl font-bold">{data.stats.totalEvents}</div>
<PieChart data={data.chartData.statusDistribution} />
```

## Security

✅ **Mixpanel Secret Never Exposed to Frontend**
- Only stored on backend in `.env`
- Never sent to browser
- Frontend calls backend, backend calls Mixpanel

✅ **CORS Restricted**
- Backend only accepts requests from configured frontend URL
- Default: `http://localhost:5174`

✅ **Environment Variables**
- Sensitive credentials in `.env` files
- `.env` files in `.gitignore` (NOT committed)
- Used only server-side

## Caching

The backend implements 5-minute caching (configurable via `CACHE_TTL`):

**Benefits:**
- Reduces API calls to Mixpanel (rate limit protection)
- Faster response times
- Reduced Mixpanel API costs

**Configuration:**
```env
CACHE_TTL=300  # Cache for 300 seconds (5 minutes)
```

To disable caching: `CACHE_TTL=0`

## Troubleshooting

### "Backend analytics server is not available"
**Solution:** Start the backend server
```bash
cd backend
npm run dev
```

### CORS error in browser console
**Solution:** Check `FRONTEND_URL` in `backend/.env` matches your actual frontend URL

### No data showing
**Solution:** Verify Mixpanel credentials and that your project has data for "Task Created" events

### Port 3001 already in use
**Solution:** Change port in `backend/.env`
```bash
# Or find and kill the process
netstat -an | findstr :3001
```

## Extending the Analytics

### Add a New Chart

1. **Create the route** in `backend/routes/analytics.js`
2. **Add data fetch** using existing MixpanelService methods
3. **Transform data** using `analyticsTransformer.js`
4. **Add component** in `src/pages/AnalyticsDashboard.jsx`

### Example: Add User Cohort Chart
```javascript
// 1. In backend route
router.get('/cohorts', async (req, res) => {
  const events = await mixpanelService.getEvents('User Signup', 30)
  const cohorts = transformAnalyticsData.formatCohortData(events)
  res.json({ data: cohorts })
})

// 2. In frontend hook
export const useCohorts = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    analyticsService.getCohorts().then(setData)
  }, [])
  return data
}

// 3. In AnalyticsDashboard
const cohorts = useCohorts()
<BarChart data={cohorts} />
```

## Performance Tips

1. **Increase Cache TTL** for less frequently updated data
2. **Limit date range** to 30 days by default (faster queries)
3. **Paginate large datasets** to avoid overwhelming dashboard
4. **Lazy load charts** that aren't immediately visible
5. **Use request.abort()** to cancel old requests when user changes filters

## Next Steps

1. ✅ Full-stack integration working
2. ⏳ Add more custom reports
3. ⏳ Implement date range picker with calendar
4. ⏳ Add export to CSV functionality
5. ⏳ Create real-time event stream (WebSocket)
6. ⏳ Deploy to production

## References

- [Mixpanel API Documentation](https://developer.mixpanel.com/reference)
- [Express Documentation](https://expressjs.com/)
- [React Hooks Documentation](https://react.dev/reference/react)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
