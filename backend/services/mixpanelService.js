import axios from 'axios'

const MIXPANEL_API_BASE = 'https://data.mixpanel.com/api/2.0'

/**
 * Mixpanel Analytics Service
 * Handles all API calls to Mixpanel using the API secret for authentication
 */
export class MixpanelService {
  constructor(apiSecret) {
    this.apiSecret = apiSecret
    this.client = axios.create({
      baseURL: MIXPANEL_API_BASE,
      timeout: 10000,
    })
  }

  /**
   * Get Basic Auth header for Mixpanel API
   */
  getAuthHeader() {
    const credentials = Buffer.from(`${this.apiSecret}:`).toString('base64')
    return {
      Authorization: `Basic ${credentials}`,
    }
  }

  /**
   * Fetch raw events from Mixpanel
   * @param {string} eventName - Event to fetch (e.g., "Dashboard Loaded", "Task Created")
   * @param {number} daysBack - Number of days back to fetch (default 30)
   */
  async getEvents(eventName, daysBack = 30) {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - daysBack)

      const fromDate = this.formatDate(startDate)
      const toDate = this.formatDate(endDate)

      const response = await this.client.get('/events', {
        headers: this.getAuthHeader(),
        params: {
          event: eventName,
          from_date: fromDate,
          to_date: toDate,
          limit: 1000,
        },
      })

      return response.data
    } catch (error) {
      console.error(`Error fetching events for "${eventName}":`, error.message)
      throw new Error(`Failed to fetch events: ${error.message}`)
    }
  }

  /**
   * Fetch segmentation data (grouping by properties)
   * @param {string} eventName - Event to segment
   * @param {string} groupBy - Property to group by (default: "properties.\/time")
   * @param {number} daysBack - Number of days back
   */
  async getSegmentation(eventName, groupBy = 'properties./time', daysBack = 30) {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - daysBack)

      const fromDate = this.formatDate(startDate)
      const toDate = this.formatDate(endDate)

      const response = await this.client.get('/segmentation', {
        headers: this.getAuthHeader(),
        params: {
          event: eventName,
          from_date: fromDate,
          to_date: toDate,
          interval: 1, // Daily interval
          unit: 'day',
        },
      })

      return response.data
    } catch (error) {
      console.error(`Error fetching segmentation for "${eventName}":`, error.message)
      throw new Error(`Failed to fetch segmentation: ${error.message}`)
    }
  }

  /**
   * Fetch retention data
   */
  async getRetention(eventName, daysBack = 30) {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - daysBack)

      const fromDate = this.formatDate(startDate)
      const toDate = this.formatDate(endDate)

      const response = await this.client.get('/retention', {
        headers: this.getAuthHeader(),
        params: {
          event: eventName,
          from_date: fromDate,
          to_date: toDate,
          interval: 1,
          unit: 'day',
          born_event: eventName,
        },
      })

      return response.data
    } catch (error) {
      console.error(`Error fetching retention for "${eventName}":`, error.message)
      throw new Error(`Failed to fetch retention: ${error.message}`)
    }
  }

  /**
   * Fetch funnel data
   */
  async getFunnel(eventNames, daysBack = 30) {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - daysBack)

      const fromDate = this.formatDate(startDate)
      const toDate = this.formatDate(endDate)

      const response = await this.client.get('/funnels', {
        headers: this.getAuthHeader(),
        params: {
          event: JSON.stringify(eventNames),
          from_date: fromDate,
          to_date: toDate,
          interval: 1,
          unit: 'day',
        },
      })

      return response.data
    } catch (error) {
      console.error(`Error fetching funnel:`, error.message)
      throw new Error(`Failed to fetch funnel: ${error.message}`)
    }
  }

  /**
   * Get top properties for an event
   */
  async getTopEvents(daysBack = 30) {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - daysBack)

      const fromDate = this.formatDate(startDate)
      const toDate = this.formatDate(endDate)

      const response = await this.client.get('/events/top', {
        headers: this.getAuthHeader(),
        params: {
          from_date: fromDate,
          to_date: toDate,
          limit: 50,
        },
      })

      return response.data
    } catch (error) {
      console.error(`Error fetching top events:`, error.message)
      throw new Error(`Failed to fetch top events: ${error.message}`)
    }
  }

  /**
   * Format date for Mixpanel API (YYYY-MM-DD)
   */
  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
}

export default MixpanelService
