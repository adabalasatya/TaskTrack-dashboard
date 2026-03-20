import axios from 'axios'

// Build API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
const API_TASKS_ENDPOINT = import.meta.env.VITE_API_ENDPOINT_TASKS || '/tasks'
const API_TASKS_URL = `${API_BASE_URL}${API_TASKS_ENDPOINT}`

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const taskService = {
  // Fetch all tasks from API
  getTasks: async () => {
    try {
      const response = await apiClient.get(API_TASKS_ENDPOINT)
      return response.data
    } catch (error) {
      console.error('Error fetching tasks:', error.message)
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch tasks from API'
      )
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await apiClient.post(API_TASKS_ENDPOINT, taskData)
      return response.data
    } catch (error) {
      console.error('Error creating task:', error.message)
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to create task'
      )
    }
  },

  // Update an existing task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await apiClient.put(
        `${API_TASKS_ENDPOINT}/${taskId}`,
        taskData
      )
      return response.data
    } catch (error) {
      console.error('Error updating task:', error.message)
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to update task'
      )
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    try {
      const response = await apiClient.delete(
        `${API_TASKS_ENDPOINT}/${taskId}`
      )
      return response.data
    } catch (error) {
      console.error('Error deleting task:', error.message)
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to delete task'
      )
    }
  },

  // Filter tasks by status
  filterByStatus: (tasks, status) => {
    if (!status) return tasks
    return tasks.filter(task => task.status === status)
  },

  // Filter tasks by priority
  filterByPriority: (tasks, priority) => {
    if (!priority) return tasks
    return tasks.filter(task => task.priority === priority)
  },

  // Search tasks by title or description
  searchTasks: (tasks, searchTerm) => {
    if (!searchTerm) return tasks
    const term = searchTerm.toLowerCase()
    return tasks.filter(
      task =>
        task.title.toLowerCase().includes(term) ||
        task.description?.toLowerCase().includes(term)
    )
  },

  // Sort tasks
  sortTasks: (tasks, sortBy, sortOrder = 'asc') => {
    const sorted = [...tasks]

    switch (sortBy) {
      case 'title':
        sorted.sort((a, b) =>
          a.title.localeCompare(b.title)
        )
        break
      case 'createdAt':
        sorted.sort((a, b) =>
          new Date(a.createdAt) - new Date(b.createdAt)
        )
        break
      case 'status':
        sorted.sort((a, b) => a.status.localeCompare(b.status))
        break
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        sorted.sort((a, b) =>
          priorityOrder[a.priority] - priorityOrder[b.priority]
        )
        break
      default:
        break
    }

    return sortOrder === 'desc' ? sorted.reverse() : sorted
  },

  // Get API configuration (useful for debugging)
  getConfig: () => ({
    baseUrl: API_BASE_URL,
    tasksEndpoint: API_TASKS_ENDPOINT,
    fullUrl: API_TASKS_URL,
  }),
}

