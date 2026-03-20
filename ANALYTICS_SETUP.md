# Mixpanel Analytics Integration

## Overview

The Task Dashboard now includes **Mixpanel analytics** to track user interactions and provide insights into how your clients are using the dashboard.

### Mixpanel Token
```
713d9f569748f7a7f108c55cc00561f5
```

---

## What's Being Tracked

### 1. **Dashboard Load**
- Event: `Dashboard Loaded`
- Properties:
  - `taskCount` - Total number of tasks
  - `completionRate` - Completion percentage

### 2. **Search**
- Event: `Task Search`
- Properties:
  - `searchTerm` - What user searched for
  - `resultCount` - Number of results

### 3. **Filters**
- Event: `Task Filter Applied`
- Properties:
  - `filterType` - "status" or "priority"
  - `filterValue` - Selected filter value
  - `resultCount` - Number of tasks after filter

### 4. **Sorting**
- Event: `Task Sort Applied`
- Properties:
  - `sortField` - Column being sorted (title, status, priority, createdAt)
  - `sortOrder` - "asc" or "desc"

### 5. **CSV Export**
- Event: `CSV Export`
- Properties:
  - `taskCount` - Number of tasks exported

### 6. **Pagination**
- Event: `Pagination Changed`
- Properties:
  - `page` - Current page number
  - `pageSize` - Items per page (10)

### 7. **Chart Interaction**
- Event: `Chart Interaction`
- Properties:
  - `chartType` - "pie", "bar", "line", or "area"

---

## Implementation Details

### Analytics Service
**File:** `src/services/analytics.js`

Provides the following functions:

```javascript
// Initialize Mixpanel
initMixpanel()

// Track specific events
trackPageView(page)
trackDashboardLoad(taskCount, completionRate)
trackSearch(searchTerm, resultCount)
trackFilter(filterType, filterValue, resultCount)
trackSort(sortField, sortOrder)
trackExport(taskCount)
trackPagination(page, pageSize)
trackChartInteraction(chartType)

// Set user properties
setUserProperties(properties)
trackEventWithUser(eventName, userId, properties)
```

### Integration Points

#### 1. **Dashboard Component** (`src/pages/Dashboard.jsx`)
```javascript
// Initialize Mixpanel on mount
useEffect(() => {
  initMixpanel()
}, [])

// Track dashboard load when tasks loaded
useEffect(() => {
  if (!loading && tasks.length > 0) {
    const stats = getAllStats(tasks)
    trackDashboardLoad(stats.totalTasks, stats.completionPercentage)
  }
}, [loading, tasks])
```

#### 2. **Task Table Component** (`src/components/TaskTable.jsx`)
All user interactions are automatically tracked:
- Search input
- Status filter dropdown
- Priority filter dropdown
- Column sorting
- Pagination buttons
- CSV export button

---

## Viewing Analytics in Mixpanel

1. Go to [mixpanel.com](https://mixpanel.com)
2. Sign in to your account
3. Navigate to **Manage** → **Projects**
4. Look for events with names:
   - `Dashboard Loaded`
   - `Task Search`
   - `Task Filter Applied`
   - `Task Sort Applied`
   - `CSV Export`
   - `Pagination Changed`
   - `Chart Interaction`

### Creating Reports

**Example Report: "Search Usage"**
1. Go to **Reports** → **Create Report**
2. Select **Funnel Analysis**
3. Add events: `Dashboard Loaded` → `Task Search`
4. View conversion rates and user engagement

**Example Report: "Export Behavior"**
1. Go to **Insights** → **Funnels**
2. Track: Users who filter → Users who export CSV
3. Identify export-heavy users

---

## Advanced Usage

### Track Custom User ID
```javascript
import { trackEventWithUser } from '../services/analytics'

trackEventWithUser('Custom Event', 'user-123', {
  customField: 'value'
})
```

### Set User Properties
```javascript
import { setUserProperties } from '../services/analytics'

setUserProperties({
  email: 'user@example.com',
  role: 'admin',
  joinDate: new Date()
})
```

---

## Privacy Considerations

- Analytics data is stored on Mixpanel servers
- No sensitive task data is tracked (only counts and metrics)
- Users can opt-out if needed (set localStorage `mixpanel.tracking_disabled = true`)
- GDPR compliant (can delete data upon request)

---

## Debugging / Testing

### View Tracked Events in Browser Console
```javascript
// Open browser DevTools Console
mixpanel.track('Test Event', { test: true })
// Check Mixpanel dashboard to confirm receipt
```

### Disable Tracking (for development)
```javascript
// In analytics.js, comment out initMixpanel() call
// Or add environment check:
if (import.meta.env.PROD) {
  initMixpanel()
}
```

---

## Metrics to Monitor

| Metric | Insight |
|--------|---------|
| Dashboard Load Rate | How often users access the dashboard |
| Search Usage | Task search frequency and patterns |
| Filter Adoption | How many users use filtering |
| Sort Frequency | Which columns users sort by most |
| Export Rate | How often data is exported |
| Pagination Depth | How many pages users browse |

---

## Future Enhancements

**Potential Metrics to Add:**
- Chart hover/interaction details
- Time spent on dashboard
- Filter combinations (e.g., High Priority + In Progress)
- User retention rates
- Feature adoption curves

---

## Support

For more on Mixpanel:
- [Mixpanel Documentation](https://docs.mixpanel.com)
- [JavaScript SDK Guide](https://developer.mixpanel.com/docs/javascript)
- [Event Tracking Best Practices](https://docs.mixpanel.com/docs/tracking-methods/javascript)

---

**Analytics Integration Complete!** 📊

Your dashboard is now collecting valuable insights about user behavior and engagement.
