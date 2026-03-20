# Quick Start Guide - Mixpanel Analytics Integration

Get up and running with the TaskTrack Analytics Dashboard in 5 minutes.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Mixpanel API credentials
- Two terminal windows

## 5-Minute Setup

### 1. Install Backend Dependencies (30 seconds)

```bash
cd backend
npm install
```

### 2. Verify Configuration (30 seconds)

Check `backend/.env` exists with:
```env
PORT=3001
FRONTEND_URL=http://localhost:5174
MIXPANEL_API_SECRET=713d9f569748f7a7f108c55cc00561f5
MIXPANEL_TOKEN=713d9f569748f7a7f108c55cc00561f5
```

Check `frontend/.env.local` exists with:
```env
VITE_ANALYTICS_API_URL=http://localhost:3001/api/analytics
```

### 3. Start Frontend (Terminal 1)

```bash
npm run dev
```

Wait for:
```
✓ Local:   http://localhost:5174/
```

### 4. Start Backend (Terminal 2)

```bash
cd backend
npm run dev
```

Wait for:
```
✓ Analytics server running on http://localhost:3001
✓ CORS enabled for http://localhost:5174
```

### 5. Open Dashboard (30 seconds)

1. Go to http://localhost:5174
2. Click "Analytics" tab
3. Select date range (7/30/90 days)
4. See Mixpanel data loading ✓

## What You See

```
Analytics Dashboard
├─ 4 Stat Cards
│  ├─ Total Events
│  ├─ Tasks Created
│  ├─ Tasks Completed
│  └─ Completion Rate
├─ 4 Charts
│  ├─ Status Distribution (Pie)
│  ├─ Event Types (Bar)
│  ├─ Daily Activity (Line)
│  └─ Cumulative Events (Area)
└─ Metrics Footer
   ├─ Avg Completion Time
   ├─ Active Users
   ├─ Last Updated
   └─ Connection Status
```

## Next: Try These Actions

### Browse Multiple Time Periods
- Click "Last 7 days" → "Last 30 days" → "Last 90 days"
- Charts update automatically
- Data refreshes every 5 minutes

### Refresh Dashboard
- Click "Refresh" button
- Fetches latest Mixpanel data
- Shows loading state during fetch

### Switch Between Dashboards
- Click "Tasks" tab for task management
- Click "Analytics" tab for Mixpanel analytics
- Navigation bar at top

## Files Created

```
New Backend Files:
├── backend/
│   ├── server.js ✓                Main Express app
│   ├── services/
│   │   └── mixpanelService.js ✓   Mixpanel API wrapper
│   ├── routes/
│   │   └── analytics.js ✓         REST API endpoints
│   ├── utils/
│   │   └── analyticsTransformer.js ✓ Data formatting
│   ├── package.json (updated) ✓   Dependencies: express, cors, axios, dotenv
│   └── .env ✓                     Configuration (Mixpanel credentials)

New Frontend Files:
├── src/
│   ├── pages/
│   │   └── AnalyticsDashboard.jsx ✓   Main analytics UI
│   ├── services/
│   │   └── mixpanelApiService.js ✓    Backend API client
│   ├── hooks/
│   │   └── useAnalytics.js ✓         React data-fetching hooks
│   └── App.jsx (updated) ✓          Added navigation + routing

Documentation:
├── BACKEND_SETUP.md ✓              Detailed backend setup
├── FULL_STACK_INTEGRATION.md ✓     Complete architecture guide
└── QUICK_START.md ✓                This file
```

## Key URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5174 | React dashboard |
| Backend | http://localhost:3001 | Analytics API |
| Health Check | http://localhost:3001/health | Server status |
| Dashboard API | http://localhost:3001/api/analytics/dashboard | Main data endpoint |

## Data Flow

```
Browser → Frontend (React)
  ↓
Frontend calls: analyticsService.getDashboard(30)
  ↓
Backend receives: GET /api/analytics/dashboard?days=30
  ↓
Backend calls: MixpanelService.getEvents('Task Created', 30)
  ↓
Mixpanel API returns: Raw events data
  ↓
Backend transforms: formatStatusDistribution(), formatEventCounts(), etc.
  ↓
Frontend displays: Charts and metrics ✓
```

## Common Issues

| Issue | Solution |
|-------|----------|
| "Backend not available" | Run `cd backend && npm run dev` in second terminal |
| Port 3001 in use | Change PORT in backend/.env or kill process |
| CORS error | Verify FRONTEND_URL in backend/.env |
| No data showing | Check Mixpanel credentials and project has events |
| Frontend stuck loading | Check browser console for error messages |

## Environment Variables

**Backend (.env):**
```env
PORT=3001                                    # Server port
FRONTEND_URL=http://localhost:5174          # CORS origin
MIXPANEL_API_SECRET=...                     # From Mixpanel Settings
MIXPANEL_TOKEN=...                          # From Mixpanel Settings
CACHE_TTL=300                               # Cache duration (seconds)
```

**Frontend (.env.local):**
```env
VITE_ANALYTICS_API_URL=http://localhost:3001/api/analytics
```

## API Endpoints

```bash
# Health Check
curl http://localhost:3001/health

# Get Events
curl "http://localhost:3001/api/analytics/events?event=Task%20Created&days=30"

# Get Dashboard (All Data)
curl "http://localhost:3001/api/analytics/dashboard?days=30"

# Get Top Events
curl "http://localhost:3001/api/analytics/top-events?days=30&limit=10"

# Get Funnel
curl -X POST http://localhost:3001/api/analytics/funnel \
  -H "Content-Type: application/json" \
  -d '{"events":["Task Created","Task Completed"],"days":30}'
```

## Next Steps

1. ✅ Dashboard running
2. 📊 Add custom queries
3. 📅 Implement date picker
4. 💾 Add CSV export
5. 🚀 Deploy to production

## Detailed Guides

- See `BACKEND_SETUP.md` for backend configuration details
- See `FULL_STACK_INTEGRATION.md` for architecture and extending
- See `README.md` for frontend task management features

## Need Help?

Check these files for more information:
- `FULL_STACK_INTEGRATION.md` - Architecture overview
- `BACKEND_SETUP.md` - Detailed API reference
- `frontend/src/pages/AnalyticsDashboard.jsx` - UI component code
- `backend/routes/analytics.js` - Backend route definitions

---

**Happy analyzing!** 📊
