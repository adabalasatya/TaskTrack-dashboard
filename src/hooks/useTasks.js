import { useState, useEffect } from 'react'
import { taskService } from '../services/taskService'

// Fallback to sample data when API is unavailable
const loadSampleData = async () => {
  try {
    const response = await fetch('/data/tasks.json')
    if (response.ok) {
      return await response.json()
    }
    return []
  } catch (err) {
    console.warn('Could not load sample data:', err)
    return []
  }
}

export const useTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const config = taskService.getConfig()
        console.log('Fetching tasks from:', config.fullUrl)
        
        const response = await taskService.getTasks()
        
        if (Array.isArray(response)) {
          setTasks(response)
        } else if (response && typeof response === 'object') {
          if (response.success && Array.isArray(response.data)) {
            setTasks(response.data)
            if (response.stats) setStats(response.stats)
          } else {
            const taskArray = response.tasks || response.data || []
            setTasks(Array.isArray(taskArray) ? taskArray : [])
          }
        } else {
          setTasks([])
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch tasks from API'
        console.warn('API unavailable, loading sample data:', errorMessage)
        
        // Fall back to sample data
        const sampleData = await loadSampleData()
        if (sampleData.length > 0) {
          setTasks(sampleData)
          setError(null) // Clear error since we have sample data
        } else {
          setError(errorMessage)
          setTasks([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  return { tasks, loading, error, stats, setTasks }
}
