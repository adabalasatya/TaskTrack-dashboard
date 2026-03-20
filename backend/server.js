import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import analyticsRoutes from './routes/analytics.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174'

/**
 * Middleware
 */
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

/**
 * Routes
 */
app.use('/api/analytics', analyticsRoutes)
app.use('/api', analyticsRoutes)

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('Error:', err.message, err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500,
  })
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
  console.log(`✓ Analytics server running on http://localhost:${PORT}`)
  console.log(`✓ CORS enabled for ${FRONTEND_URL}`)
  console.log(`✓ Health check: http://localhost:${PORT}/health`)
})

export default app
