/**
 * Analytics Data Transformer
 * Converts raw Mixpanel data into dashboard-friendly formats
 */

export const transformAnalyticsData = {
  /**
   * Calculate dashboard stats from events
   */
  calculateStats: (events) => {
    const totalEvents = events?.length || 0
    const taskCreatedEvents = events?.filter(e => e.event === 'Task Created')?.length || 0
    const taskCompletedEvents = events?.filter(e => e.event === 'Task Completed')?.length || 0
    const completionRate = taskCreatedEvents > 0 
      ? Math.round((taskCompletedEvents / taskCreatedEvents) * 100)
      : 0

    return {
      totalEvents,
      taskCreatedEvents,
      taskCompletedEvents,
      completionRate,
      activeUsers: new Set(events?.map(e => e.distinctId || e.userId)?.filter(Boolean))?.size || 0,
    }
  },

  /**
   * Transform segmentation data into timeline format for charts
   */
  formatTimelineData: (segmentationData) => {
    const result = []
    
    if (segmentationData?.data?.series) {
      const timeline = segmentationData.data.series[0] || {}
      const dates = segmentationData.data.dates || {}

      Object.entries(timeline).forEach(([dateStr, value]) => {
        const label = dates[dateStr] || dateStr
        result.push({
          date: label,
          count: value || 0,
        })
      })
    }

    return result.sort((a, b) => new Date(a.date) - new Date(b.date))
  },

  /**
   * Format daily comparison data (created vs completed)
   */
  formatDailyComparison: (createdData, completedData) => {
    const dates = new Set()
    const result = {}

    // Collect all dates
    if (createdData?.data?.series?.[0]) {
      Object.keys(createdData.data.series[0]).forEach(date => dates.add(date))
    }
    if (completedData?.data?.series?.[0]) {
      Object.keys(completedData.data.series[0]).forEach(date => dates.add(date))
    }

    // Build comparison data
    Array.from(dates).sort().forEach(date => {
      const createdCount = createdData?.data?.series?.[0]?.[date] || 0
      const completedCount = completedData?.data?.series?.[0]?.[date] || 0

      result[date] = {
        date: createdData?.data?.dates?.[date] || date,
        created: createdCount,
        completed: completedCount,
        pending: Math.max(0, createdCount - completedCount),
      }
    })

    return Object.values(result).sort((a, b) => new Date(a.date) - new Date(b.date))
  },

  /**
   * Format events for pie chart (status distribution)
   */
  formatStatusDistribution: (events) => {
    const statusMap = {}
    
    events?.forEach(event => {
      const status = event.properties?.status || 'unknown'
      statusMap[status] = (statusMap[status] || 0) + 1
    })

    return Object.entries(statusMap).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      fill: getStatusColor(name),
    }))
  },

  /**
   * Format events for bar chart (event counts)
   */
  formatEventCounts: (events) => {
    const eventCounts = {}
    
    events?.forEach(event => {
      const eventName = event.event || 'Unknown'
      eventCounts[eventName] = (eventCounts[eventName] || 0) + 1
    })

    return Object.entries(eventCounts).map(([name, count]) => ({
      name: name.replace('Task ', ''),
      count,
      fill: getEventColor(name),
    }))
  },

  /**
   * Format cumulative data for area chart
   */
  formatCumulativeData: (events) => {
    const dateMap = {}
    
    // Sort events by time
    const sortedEvents = [...(events || [])].sort((a, b) => 
      new Date(a.receive_ts || a.time) - new Date(b.receive_ts || b.time)
    )

    let cumulative = 0
    sortedEvents.forEach(event => {
      const date = new Date(event.receive_ts || event.time)
      const dateStr = date.toISOString().split('T')[0]
      
      if (!dateMap[dateStr]) {
        cumulative += 1
        dateMap[dateStr] = {
          date: formatDateDisplay(date),
          total: cumulative,
        }
      }
    })

    return Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date))
  },

  /**
   * Format raw events for table display
   */
  formatEventTable: (events) => {
    return events?.map(event => ({
      id: event.insert_id || Math.random(),
      event: event.event || 'Unknown',
      user: event.distinctId || event.userId || 'Anonymous',
      date: new Date(event.receive_ts || event.time).toLocaleString(),
      properties: JSON.stringify(event.properties || {}),
    })) || []
  },
}

/**
 * Get color for status
 */
function getStatusColor(status) {
  const colors = {
    completed: '#10b981',
    'in-progress': '#f59e0b',
    pending: '#ef4444',
  }
  return colors[status] || '#6b7280'
}

/**
 * Get color for event type
 */
function getEventColor(eventName) {
  const colors = {
    'Task Created': '#3b82f6',
    'Task Completed': '#10b981',
    'Task Updated': '#f59e0b',
    'Task Deleted': '#ef4444',
  }
  return colors[eventName] || '#8b5cf6'
}

/**
 * Format date for display
 */
function formatDateDisplay(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/**
 * Calculate average completion time
 */
export const calculateAvgCompletionTime = (events) => {
  const createdEvents = new Map()
  const completionTimes = []

  events?.forEach(event => {
    if (event.event === 'Task Created') {
      createdEvents.set(event.properties?.taskId, event.time)
    } else if (event.event === 'Task Completed') {
      const createdTime = createdEvents.get(event.properties?.taskId)
      if (createdTime) {
        const diffMs = new Date(event.time) - new Date(createdTime)
        const diffDays = diffMs / (1000 * 60 * 60 * 24)
        completionTimes.push(diffDays)
      }
    }
  })

  if (completionTimes.length === 0) return 0

  const avg = completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
  return Math.round(avg * 10) / 10 // Round to 1 decimal
}

export default transformAnalyticsData
