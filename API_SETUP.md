# API Configuration Guide

## Remove Dummy Data - Fetch from API

Your dashboard is now configured to fetch tasks **only from an API** instead of using static JSON files.

---

## 🔧 Configuration

### Step 1: Update `.env.local`

Edit the file: `.env.local`

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_ENDPOINT_TASKS=/tasks
```

### Replace with your actual API:

**Example 1: Local Backend**
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_ENDPOINT_TASKS=/tasks
```
Full URL: `http://localhost:3000/api/tasks`

**Example 2: Remote API**
```env
VITE_API_BASE_URL=https://api.example.com/v1
VITE_API_ENDPOINT_TASKS=/tasks
```
Full URL: `https://api.example.com/v1/tasks`

**Example 3: Simple REST API**
```env
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
VITE_API_ENDPOINT_TASKS=/todos
```

---

## 📋 Expected API Response Format

Your API should return tasks in one of these formats:

### Format 1: Array of tasks
```json
[
  {
    "id": "task-1",
    "title": "Design system implementation",
    "description": "Create comprehensive design system",
    "status": "completed",
    "priority": "high",
    "createdAt": "2024-02-01T09:00:00Z",
    "completedAt": "2024-02-08T17:00:00Z",
    "photos": 12
  },
  ...
]
```

### Format 2: Wrapped in `tasks` key
```json
{
  "tasks": [
    { "id": "task-1", ... },
    { "id": "task-2", ... }
  ]
}
```

### Format 3: Wrapped in `data` key
```json
{
  "data": [
    { "id": "task-1", ... },
    { "id": "task-2", ... }
  ]
}
```

---

## 📝 Task Object Schema

Each task should have these fields:

```javascript
{
  // Required
  id: string,                  // Unique identifier
  title: string,               // 1-100 characters
  
  // Optional
  description?: string,        // Task details
  status?: "pending" | "in-progress" | "completed",
  priority?: "low" | "medium" | "high",
  createdAt?: ISO 8601 date,  // "2024-02-01T09:00:00Z"
  completedAt?: ISO 8601 date,
  photos?: number | number[],  // Count or array of photo URLs
  location?: {                 // GPS location
    latitude: number,
    longitude: number,
    address?: string
  }
}
```

---

## 🔌 Available API Operations

The `taskService` now supports:

```javascript
// Fetch all tasks
await taskService.getTasks()

// Create a new task
await taskService.createTask({
  title: "New Task",
  description: "Task details",
  priority: "high"
})

// Update an existing task
await taskService.updateTask(taskId, {
  title: "Updated Title",
  status: "completed"
})

// Delete a task
await taskService.deleteTask(taskId)
```

---

## 🧪 Testing the API Setup

### Method 1: Check Console Logs
1. Open browser DevTools (F12)
2. Go to Console tab
3. You should see: `Fetching tasks from: http://localhost:3000/api/tasks`

### Method 2: Verify API Response
```bash
# Test with curl
curl http://localhost:3000/api/tasks

# Should return an array or wrapped object
```

### Method 3: Use Network Tab
1. Open DevTools → Network tab
2. Reload the dashboard
3. Look for request to `/api/tasks` or `/tasks`
4. Check Response tab for data

---

## ⚠️ Common Issues & Solutions

### Issue: "Failed to fetch tasks from API"

**Solution 1: Check API URL**
```env
# Verify the base URL is correct
VITE_API_BASE_URL=http://localhost:3000/api
# Should be http://, not https://
# No trailing slash after "api"
```

**Solution 2: CORS Issues**
Your backend API must allow requests from `localhost:5174`:
```javascript
// Node.js/Express example
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}))
```

**Solution 3: API Not Running**
Make sure your backend server is running:
```bash
# Start your API server
npm run server
# or
node server.js
```

---

## 🚀 NextSteps

1. **Update `.env.local`** with your API endpoint
2. **Restart the dev server**: Stop and run `npm run dev`
3. **Check Console** for the "Fetching tasks from:" message
4. **Verify response** in Network tab
5. **Dashboard** should now display your live API data

---

## 📊 Example: Node.js/Express Backend

If you need a simple backend to test with:

```javascript
// server.js
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Sample tasks from database/API
const tasks = [
  {
    id: 'task-1',
    title: 'Design system',
    description: 'Create design system',
    status: 'completed',
    priority: 'high',
    createdAt: '2024-02-01T09:00:00Z',
    completedAt: '2024-02-08T17:00:00Z',
    photos: 12
  },
  // ... more tasks
]

// GET /api/tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks)
})

app.listen(3000, () => {
  console.log('API running on http://localhost:3000')
})
```

Start with:
```bash
node server.js
```

Then set your `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_ENDPOINT_TASKS=/tasks
```

---

## ✅ Verification Checklist

- [ ] `.env.local` file created with correct API URL
- [ ] API endpoint returns an array or wrapped object
- [ ] Each task has `id`, `title`, and valid `createdAt` date
- [ ] Dev server restarted (`npm run dev`)
- [ ] Console shows "Fetching tasks from: [URL]"
- [ ] Network tab shows successful API response
- [ ] Dashboard displays fetched tasks (no dummy data)
- [ ] Search, filter, sort work with real data
- [ ] Charts display actual statistics

---

## 🔗 API Integration Complete!

Your dashboard is now **API-driven** instead of using static data. All charts, stats, and tables will display real data from your backend.

**Questions?** Check the console for error messages and the Network tab for API response details.
