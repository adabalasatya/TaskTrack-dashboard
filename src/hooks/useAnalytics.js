import { useState, useEffect, useCallback } from 'react'
import analyticsService from '../services/mixpanelApiService'

/**
 * Hook to fetch and manage analytics data
 */
export const useAnalytics = (days = 30) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [backendHealthy, setBackendHealthy] = useState(true)

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Check backend health
      const isHealthy = await analyticsService.getHealth()
      setBackendHealthy(isHealthy)

      if (!isHealthy) {
        throw new Error('Backend analytics server is not available')
      }

      const dashboardData = await analyticsService.getDashboard(days)
      setData(dashboardData)
    } catch (err) {
      console.error('Analytics error:', err)
      setError(err.message || 'Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    fetchDashboard()
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchDashboard, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchDashboard])

  const refetch = useCallback(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return {
    data,
    loading,
    error,
    backendHealthy,
    refetch,
  }
}

/**
 * Hook to fetch specific events
 */
export const useAnalyticsEvents = (eventName, days = 30) => {
  const [events, setEvents] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEvents = useCallback(async () => {
    if (!eventName) return

    try {
      setLoading(true)
      setError(null)
      const result = await analyticsService.getEvents(eventName, days)
      setEvents(result.events || [])
      setStats(result.stats || null)
    } catch (err) {
      console.error('Failed to fetch events:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [eventName, days])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return { events, stats, loading, error, refetch: fetchEvents }
}

/**
 * Hook to fetch segmentation data
 */
export const useAnalyticsSegmentation = (eventName, property = 'distinctId', days = 30) => {
  const [data, setData] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSegmentation = useCallback(async () => {
    if (!eventName) return

    try {
      setLoading(true)
      setError(null)
      const result = await analyticsService.getSegmentation(eventName, property, days)
      setData(result.raw || null)
      setTimeline(result.timeline || [])
    } catch (err) {
      console.error('Failed to fetch segmentation:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [eventName, property, days])

  useEffect(() => {
    fetchSegmentation()
  }, [fetchSegmentation])

  return { data, timeline, loading, error, refetch: fetchSegmentation }
}

/**
 * Hook to fetch top events
 */
export const useTopEvents = (days = 30, limit = 10) => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTopEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await analyticsService.getTopEvents(days, limit)
      setEvents(result.events || [])
    } catch (err) {
      console.error('Failed to fetch top events:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [days, limit])

  useEffect(() => {
    fetchTopEvents()
  }, [fetchTopEvents])

  return { events, loading, error, refetch: fetchTopEvents }
}

export default useAnalytics
