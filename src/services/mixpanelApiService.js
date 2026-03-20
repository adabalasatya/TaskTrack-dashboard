import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_ANALYTICS_API_URL || 'http://localhost:3001/api/analytics'

const analyticsApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

/**
 * Analytics API Service
 * Communicates with backend to fetch Mixpanel data
 */
export const analyticsService = {
  /**
   * Get raw events for a specific event type
   */
  getEvents: async (eventName, days = 30) => {
    try {
      const response = await analyticsApi.get('/events', {
        params: { event: eventName, days },
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch events:', error)
      throw error
    }
  },

  /**
   * Get event segmentation data
   */
  getSegmentation: async (eventName, property = 'distinctId', days = 30) => {
    try {
      const response = await analyticsApi.get('/segmentation', {
        params: { event: eventName, property, days },
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch segmentation:', error)
      throw error
    }
  },

  /**
   * Get top events
   */
  getTopEvents: async (days = 30, limit = 10) => {
    try {
      const response = await analyticsApi.get('/top-events', {
        params: { days, limit },
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch top events:', error)
      throw error
    }
  },

  /**
   * Get retention data
   */
  getRetention: async (eventName, days = 30) => {
    try {
      const response = await analyticsApi.get('/retention', {
        params: { event: eventName, days },
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch retention:', error)
      throw error
    }
  },

  /**
   * Get funnel data
   */
  getFunnel: async (events, days = 30) => {
    try {
      const response = await analyticsApi.post('/funnel', {
        events,
        days,
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch funnel:', error)
      throw error
    }
  },

  /**
   * Get complete dashboard data
   */
  getDashboard: async (days = 30) => {
    try {
      const response = await analyticsApi.get('/dashboard', {
        params: { days },
      })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      throw error
    }
  },

  /**
   * Get health status
   */
  getHealth: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL.replace('/api/analytics', '')}/health`, {
        timeout: 5000,
      })
      return response.data.status === 'ok'
    } catch (error) {
      console.warn('Backend health check failed:', error.message)
      return false
    }
  },
}

export default analyticsService
