import express from 'express'
import dotenv from 'dotenv'
import MixpanelService from '../services/mixpanelService.js'
import { transformAnalyticsData, calculateAvgCompletionTime } from '../utils/analyticsTransformer.js'

dotenv.config()

const router = express.Router()
const mixpanelService = new MixpanelService(process.env.MIXPANEL_API_SECRET)

/**
 * GET /api/analytics/events
 * Fetch raw events from Mixpanel
 * Query params:
 *   - event: Event name (optional, e.g., "Task Created")
 *   - days: Number of days to look back (default: 30)
 */
router.get('/events', async (req, res, next) => {
  try {
    const { event, days = 30 } = req.query
    
    if (!event) {
      return res.status(400).json({ error: 'event parameter is required' })
    }

    const events = await mixpanelService.getEvents(event, parseInt(days))
    const stats = transformAnalyticsData.calculateStats(events.results || [])

    res.json({
      success: true,
      data: {
        events: events.results || [],
        stats,
        total: events.results?.length || 0,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/analytics/segmentation
 * Get event segmentation (e.g., events grouped by user, status, etc.)
 * Query params:
 *   - event: Event name (required)
 *   - property: Property to segment by (default: "distinctId")
 *   - days: Number of days to look back (default: 30)
 */
router.get('/segmentation', async (req, res, next) => {
  try {
    const { event, property = 'distinctId', days = 30 } = req.query

    if (!event) {
      return res.status(400).json({ error: 'event parameter is required' })
    }

    const segmentation = await mixpanelService.getSegmentation(
      event,
      property,
      parseInt(days)
    )
    const timelineData = transformAnalyticsData.formatTimelineData(segmentation)

    res.json({
      success: true,
      data: {
        raw: segmentation,
        timeline: timelineData,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/analytics/top-events
 * Get top events over a time period
 * Query params:
 *   - days: Number of days to look back (default: 30)
 *   - limit: Limit results to N events (default: 10)
 */
router.get('/top-events', async (req, res, next) => {
  try {
    const { days = 30, limit = 10 } = req.query

    const topEvents = await mixpanelService.getTopEvents(parseInt(days))
    const limited = (topEvents.results || [])
      .slice(0, parseInt(limit))

    res.json({
      success: true,
      data: {
        events: limited,
        total: limited.length,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/analytics/retention
 * Get event retention data
 * Query params:
 *   - event: Event name (required)
 *   - days: Number of days to look back (default: 30)
 */
router.get('/retention', async (req, res, next) => {
  try {
    const { event, days = 30 } = req.query

    if (!event) {
      return res.status(400).json({ error: 'event parameter is required' })
    }

    const retention = await mixpanelService.getRetention(event, parseInt(days))

    res.json({
      success: true,
      data: retention,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/analytics/funnel
 * Get funnel analysis for a sequence of events
 * Body:
 *   - events: Array of event names (required)
 *   - days: Number of days to look back (default: 30)
 */
router.post('/funnel', async (req, res, next) => {
  try {
    const { events, days = 30 } = req.body

    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ 
        error: 'events array parameter is required and must have at least 1 event' 
      })
    }

    const funnel = await mixpanelService.getFunnel(events, parseInt(days))

    res.json({
      success: true,
      data: funnel,
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/tasks
 * Fetch tasks from Mixpanel analytics and transform to task format
 * Query params:
 *   - days: Number of days to look back (default: 30)
 */
router.get('/tasks', async (req, res, next) => {
  try {
    const { days = 30 } = req.query
    const daysInt = parseInt(days)

    const [createdEvents, completedEvents, dashboardEvents] = await Promise.all([
      mixpanelService.getEvents('Task Created', daysInt).catch(() => ({ results: [] })),
      mixpanelService.getEvents('Task Completed', daysInt).catch(() => ({ results: [] })),
      mixpanelService.getEvents('Dashboard Loaded', daysInt).catch(() => ({ results: [] })),
    ])

    const createdTasks = createdEvents.results || []
    const completedTasks = completedEvents.results || []
    const dashboardLoads = dashboardEvents.results || []

    const allTaskIds = new Set([
      ...createdTasks.map(e => e.properties?.taskId || e.properties?.id || e.event),
      ...completedTasks.map(e => e.properties?.taskId || e.properties?.id || e.event),
    ])

    const tasks = Array.from(allTaskIds).map((taskId, index) => {
      const created = createdTasks.find(e => 
        (e.properties?.taskId || e.properties?.id || e.event) === taskId
      )
      const completed = completedTasks.find(e => 
        (e.properties?.taskId || e.properties?.id || e.event) === taskId
      )

      const hasCreated = !!created
      const hasCompleted = !!completed

      let status = 'pending'
      if (hasCreated && hasCompleted) status = 'completed'
      else if (hasCreated) status = 'in-progress'

      const priorities = ['high', 'medium', 'low']
      const priority = created?.properties?.priority || 
                       completed?.properties?.priority || 
                       priorities[index % 3]

      return {
        id: `task-${index + 1}`,
        title: typeof taskId === 'string' && taskId.length < 50 
          ? taskId 
          : `Task ${index + 1}`,
        description: created?.properties?.description || 
                     completed?.properties?.description || 
                     'Analytics task from Mixpanel',
        status,
        priority,
        createdAt: created?.properties?.time || completed?.properties?.time || new Date().toISOString(),
        completedAt: completed?.properties?.time || null,
        photos: created?.properties?.photos || completed?.properties?.photos || 0,
        eventCount: dashboardLoads.filter(e => 
          e.properties?.taskId === taskId
        ).length,
      }
    })

    const stats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
      pendingTasks: tasks.filter(t => t.status === 'pending').length,
      totalPhotos: tasks.reduce((sum, t) => sum + (t.photos || 0), 0),
    }

    res.json({
      success: true,
      data: tasks,
      stats,
      meta: {
        total: tasks.length,
        daysBack: daysInt,
        createdEvents: createdTasks.length,
        completedEvents: completedTasks.length,
      }
    })
  } catch (error) {
    console.error('Error fetching tasks from Mixpanel:', error.message)
    res.status(500).json({
      error: 'Failed to fetch tasks from Mixpanel API',
      message: error.message,
    })
  }
})

/**
 * GET /api/analytics/dashboard
 * Get dashboard data combining multiple analytics
 * Query params:
 *   - days: Number of days to look back (default: 30)
 */
router.get('/dashboard', async (req, res, next) => {
  try {
    const { days = 30 } = req.query
    const daysInt = parseInt(days)

    // Fetch multiple data sources in parallel
    const [createdEvents, completedEvents, topEvents] = await Promise.all([
      mixpanelService.getEvents('Task Created', daysInt).catch(() => ({ results: [] })),
      mixpanelService.getEvents('Task Completed', daysInt).catch(() => ({ results: [] })),
      mixpanelService.getTopEvents(daysInt).catch(() => ({ results: [] })),
    ])

    const allEvents = [
      ...(createdEvents.results || []),
      ...(completedEvents.results || []),
    ]

    const stats = transformAnalyticsData.calculateStats(allEvents)
    const dailyComparison = transformAnalyticsData.formatDailyComparison(
      { data: { series: [{}], dates: {} } },
      { data: { series: [{}], dates: {} } }
    )
    const statusDist = transformAnalyticsData.formatStatusDistribution(allEvents)
    const eventCounts = transformAnalyticsData.formatEventCounts(topEvents.results || [])
    const avgCompletionTime = calculateAvgCompletionTime(allEvents)

    res.json({
      success: true,
      data: {
        stats,
        chartData: {
          statusDistribution: statusDist,
          eventCounts,
          dailyComparison,
        },
        metrics: {
          avgCompletionTime,
          lastUpdated: new Date().toISOString(),
        },
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
