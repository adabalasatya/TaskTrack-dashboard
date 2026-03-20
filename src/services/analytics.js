import mixpanel from 'mixpanel-browser'

const MIXPANEL_TOKEN = '713d9f569748f7a7f108c55cc00561f5'

// Initialize Mixpanel
export const initMixpanel = () => {
  mixpanel.init(MIXPANEL_TOKEN, {
    track_pageview: true,
    persistence: 'localStorage',
  })
}

// Track page view
export const trackPageView = (page) => {
  mixpanel.track('Page Viewed', {
    page,
    timestamp: new Date().toISOString(),
  })
}

// Track dashboard load
export const trackDashboardLoad = (taskCount, completionRate) => {
  mixpanel.track('Dashboard Loaded', {
    taskCount,
    completionRate,
    timestamp: new Date().toISOString(),
  })
}

// Track search interaction
export const trackSearch = (searchTerm, resultCount) => {
  mixpanel.track('Task Search', {
    searchTerm,
    resultCount,
    timestamp: new Date().toISOString(),
  })
}

// Track filter interaction
export const trackFilter = (filterType, filterValue, resultCount) => {
  mixpanel.track('Task Filter Applied', {
    filterType, // 'status' or 'priority'
    filterValue,
    resultCount,
    timestamp: new Date().toISOString(),
  })
}

// Track sort interaction
export const trackSort = (sortField, sortOrder) => {
  mixpanel.track('Task Sort Applied', {
    sortField,
    sortOrder,
    timestamp: new Date().toISOString(),
  })
}

// Track CSV export
export const trackExport = (taskCount) => {
  mixpanel.track('CSV Export', {
    taskCount,
    timestamp: new Date().toISOString(),
  })
}

// Track pagination
export const trackPagination = (page, pageSize) => {
  mixpanel.track('Pagination Changed', {
    page,
    pageSize,
    timestamp: new Date().toISOString(),
  })
}

// Track chart interaction (hover, click, etc.)
export const trackChartInteraction = (chartType) => {
  mixpanel.track('Chart Interaction', {
    chartType, // 'pie', 'bar', 'line', 'area'
    timestamp: new Date().toISOString(),
  })
}

// Track user properties
export const setUserProperties = (properties) => {
  mixpanel.people.set(properties)
}

// Track distinct event with user ID
export const trackEventWithUser = (eventName, userId, properties) => {
  mixpanel.identify(userId)
  mixpanel.track(eventName, {
    ...properties,
    userId,
    timestamp: new Date().toISOString(),
  })
}
