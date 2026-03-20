import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')))

/**
 * Middleware
 */
app.use(cors())
app.use(express.json())

/**
 * Load sample task data
 */
const tasksPath = path.join(__dirname, './public/data/tasks.json')
let taskData = []

try {
  const data = fs.readFileSync(tasksPath, 'utf-8')
  taskData = JSON.parse(data)
  console.log(`✓ Loaded ${taskData.length} tasks from sample data`)
} catch (error) {
  console.warn('⚠ Could not load task data:', error.message)
  taskData = []
}

/**
 * Request logging middleware
 */
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'tasks-api', timestamp: new Date().toISOString() })
})

/**
 * GET /api/tasks - Get all tasks
 */
app.get('/api/tasks', (req, res) => {
  res.json(taskData)
})

/**
 * GET /tasks - Serve static JSON file (for direct access)
 */
app.get('/tasks', (req, res) => {
  res.json(taskData)
})

/**
 * GET /api/tasks/:id - Get a single task
 */
app.get('/api/tasks/:id', (req, res) => {
  const task = taskData.find(t => t.id === req.params.id)
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }
  res.json(task)
})

/**
 * POST /api/tasks - Create a new task
 */
app.post('/api/tasks', (req, res) => {
  const { title, description, status, priority, photos } = req.body

  if (!title) {
    return res.status(400).json({ error: 'Title is required' })
  }

  const newTask = {
    id: `task-${Date.now()}`,
    title,
    description: description || '',
    status: status || 'pending',
    priority: priority || 'medium',
    createdAt: new Date().toISOString(),
    completedAt: status === 'completed' ? new Date().toISOString() : null,
    photos: photos || 0,
  }

  taskData.push(newTask)
  res.status(201).json(newTask)
})

/**
 * PUT /api/tasks/:id - Update a task
 */
app.put('/api/tasks/:id', (req, res) => {
  const taskIndex = taskData.findIndex(t => t.id === req.params.id)
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' })
  }

  const updated = {
    ...taskData[taskIndex],
    ...req.body,
    id: taskData[taskIndex].id, // Don't allow ID changes
    createdAt: taskData[taskIndex].createdAt, // Don't allow creation date changes
  }

  // Handle completion date
  if (req.body.status === 'completed' && taskData[taskIndex].status !== 'completed') {
    updated.completedAt = new Date().toISOString()
  } else if (req.body.status !== 'completed') {
    updated.completedAt = null
  }

  taskData[taskIndex] = updated
  res.json(updated)
})

/**
 * DELETE /api/tasks/:id - Delete a task
 */
app.delete('/api/tasks/:id', (req, res) => {
  const taskIndex = taskData.findIndex(t => t.id === req.params.id)
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' })
  }

  const deleted = taskData.splice(taskIndex, 1)[0]
  res.json(deleted)
})

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(500).json({ error: 'Internal Server Error' })
})

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`✓ Tasks API server running on http://localhost:${PORT}`)
  console.log(`✓ CORS enabled`)
  console.log(`✓ Health check: http://localhost:${PORT}/health`)
  console.log(`✓ Base URL: http://localhost:${PORT}/api`)
  console.log(`✓ Static files served from: ${path.join(__dirname, 'public')}`)
})
