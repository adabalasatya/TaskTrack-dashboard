# Mixpanel Analytics Backend Setup

This guide helps you set up and run the Mixpanel analytics backend server.

## Prerequisites

- Node.js 16+ installed
- Backend dependencies installed (`npm install` in `/backend` folder)
- Mixpanel API credentials configured in `.env` file

## Installation

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create or update the `.env` file in the `/backend` directory:

```env
PORT=3001
FRONTEND_URL=http://localhost:5174
MIXPANEL_API_SECRET=713d9f569748f7a7f108c55cc00561f5
MIXPANEL_TOKEN=713d9f569748f7a7f108c55cc00561f5
CACHE_TTL=300
```

**Configuration Details:**
- `PORT`: Backend server port (default: 3001)
- `FRONTEND_URL`: Frontend URL for CORS (must match your dev server)
- `MIXPANEL_API_SECRET`: Mixpanel Service Account Secret (from Mixpanel Settings)
- `MIXPANEL_TOKEN`: Mixpanel Project Token (from Mixpanel Settings)
- `CACHE_TTL`: Cache duration in seconds (default: 300 = 5 minutes)

### 3. Configure Frontend

Update `.env.local` in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_ENDPOINT_TASKS=/tasks
VITE_ANALYTICS_API_URL=http://localhost:3001/api/analytics
```

## Running the Backend

### Development Mode (with auto-reload)

```bash
cd backend
npm run dev
```

You should see:
```
✓ Analytics server running on http://localhost:3001
✓ CORS enabled for http://localhost:5174
✓ Health check: http://localhost:3001/health
```

### Production Mode

```bash
cd backend
npm start
```

## API Endpoints

Once the server is running, the following endpoints are available:

### Health Check
```
GET http://localhost:3001/health
```

### Analytics Endpoints

#### Get Events
```
GET /api/analytics/events?event=Task%20Created&days=30
```

**Query Parameters:**
- `event` (required): Event name (e.g., "Task Created", "Task Completed")
- `days` (optional): Number of days to look back (default: 30)

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [...],
    "stats": {
      "totalEvents": 100,
      "taskCreatedEvents": 50,
      "taskCompletedEvents": 40,
      "completionRate": 80,
      "activeUsers": 10
    },
    "total": 50
  }
}
```

#### Get Segmentation
```
GET /api/analytics/segmentation?event=Task%20Created&property=distinctId&days=30
```

**Query Parameters:**
- `event` (required): Event name
- `property` (optional): Property to segment by (default: "distinctId")
- `days` (optional): Number of days to look back (default: 30)

#### Get Top Events
```
GET /api/analytics/top-events?days=30&limit=10
```

**Query Parameters:**
- `days` (optional): Number of days to look back (default: 30)
- `limit` (optional): Limit results to N events (default: 10)

#### Get Retention
```
GET /api/analytics/retention?event=Task%20Created&days=30
```

**Query Parameters:**
- `event` (required): Event name
- `days` (optional): Number of days to look back (default: 30)

#### Get Funnel
```
POST /api/analytics/funnel
Content-Type: application/json

{
  "events": ["Task Created", "Task Updated", "Task Completed"],
  "days": 30
}
```

#### Get Dashboard (All Data)
```
GET /api/analytics/dashboard?days=30
```

**Query Parameters:**
- `days` (optional): Number of days to look back (default: 30)

Returns comprehensive dashboard data including stats, charts, and metrics.

## Troubleshooting

### Backend won't start
- Make sure port 3001 is not in use: `netstat -an | findstr :3001`
- Check that `.env` file exists and is properly configured
- Verify Node.js version: `node --version` (should be 16+)

### CORS errors
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL exactly
- Default is `http://localhost:5174` for Vite dev server

### No data from Mixpanel
- Verify `MIXPANEL_API_SECRET` and `MIXPANEL_TOKEN` are correct
- Make sure your Mixpanel project has data for the requested events
- Check Mixpanel account has API access enabled

### Connection refused
- Make sure frontend is trying to connect to `http://localhost:3001`
- Check `VITE_ANALYTICS_API_URL` in frontend `.env.local`

## Architecture

```
Frontend (http://localhost:5174)
    ↓ (axios)
Backend Analytics Server (http://localhost:3001)
    ↓ (axios with Basic Auth)
Mixpanel API (https://data.mixpanel.com/api/2.0)
```

**Security Note:** The Mixpanel API secret is only stored on the backend. The frontend never sees it, preventing credential exposure.

## Performance

- Caching is enabled with 5-minute TTL by default
- Adjust `CACHE_TTL` to balance freshness vs. API calls
- Mixpanel API has rate limits; caching helps reduce requests

## Next Steps

1. ✅ Backend server running
2. ⏳ Frontend making requests to backend
3. ⏳ Analytics dashboard displaying Mixpanel data
4. ⏳ Add date range filters and custom queries
5. ⏳ Deploy to production

For more details, see the main README.md
