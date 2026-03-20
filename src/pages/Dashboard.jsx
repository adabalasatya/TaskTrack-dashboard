import { useEffect, useState } from 'react'
import { 
  Loader, 
  AlertCircle, 
  Activity, 
  RefreshCw, 
  ChevronDown, 
  Maximize2,
  Minimize2,
  Filter,
  Download,
  TrendingUp,
  Clock,
  CheckCircle2,
  Upload,
  FileJson,
  X,
  Check,
  AlertTriangle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { StatCards, TaskTable } from '../components'
import { StatusPieChart, PriorityBarChart, TasksOverTimeChart, CumulativeTasksAreaChart } from '../charts'
import { useTasks } from '../hooks/useTasks'
import {
  getAllStats,
  getStatusDistribution,
  getPriorityDistribution,
  getTasksOverTime,
  getCumulativeTasks
} from '../utils/dataProcessing'
import { initMixpanel, trackDashboardLoad } from '../services/analytics'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

/**
 * Normalizes a task from any supported format into the standard dashboard format.
 *
 * Supported input formats:
 *  - Standard:   { id, title, status, priority, createdAt, dueDate }
 *  - TaskTrack:  { id, title, completed (boolean), priority, createdAt, location, photos }
 *
 * Output always contains:
 *  { id, title, status ("completed" | "in-progress" | "pending"), priority, createdAt, ...rest }
 */
const normalizeTask = (task) => {
  // Already has a status string — nothing to do
  if (task.status !== undefined) return task

  // TaskTrack format: derive status from the `completed` boolean
  const status = task.completed === true ? 'completed' : 'pending'

  return {
    ...task,
    status,
  }
}

/**
 * Returns true when a (possibly un-normalized) task object has the minimum
 * fields required by the dashboard.
 */
const isValidTask = (task) => {
  if (!task) return false

  const hasId    = task.id    !== undefined
  const hasTitle = task.title !== undefined

  // Accept tasks that carry either a `status` string OR a `completed` boolean
  const hasStatusField    = task.status    !== undefined
  const hasCompletedField = task.completed !== undefined

  return hasId && hasTitle && (hasStatusField || hasCompletedField)
}

export const Dashboard = () => {
  const { tasks: apiTasks, loading, error, refetch } = useTasks()
  const [isRefreshing, setIsRefreshing]       = useState(false)
  const [expandedChart, setExpandedChart]     = useState(null)
  const [dateRange, setDateRange]             = useState('all')
  const [showFilters, setShowFilters]         = useState(false)
  const [uploadedTasks, setUploadedTasks]     = useState([])
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadedFileName, setUploadedFileName]   = useState('')
  const [uploadError, setUploadError]         = useState('')
  const [uploadSuccess, setUploadSuccess]     = useState(false)
  const [useUploadedData, setUseUploadedData] = useState(false)
  
  // Use either API data or uploaded data
  const tasks = useUploadedData && uploadedTasks.length > 0 ? uploadedTasks : apiTasks

  // Initialize analytics on mount
  useEffect(() => {
    initMixpanel()
  }, [])

  // Track dashboard load when tasks are loaded
  useEffect(() => {
    if (!loading && tasks.length > 0) {
      const stats = getAllStats(tasks)
      trackDashboardLoad(stats.totalTasks, stats.completionPercentage)
    }
  }, [loading, tasks])

  // Handle manual refresh with loading animation
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
    // Clear uploaded data when refreshing from API
    if (useUploadedData) {
      setUseUploadedData(false)
      setUploadedTasks([])
    }
  }

  // Export dashboard data as JSON
  const handleExport = () => {
    const exportData = {
      tasks,
      stats: getAllStats(tasks),
      exportedAt: new Date().toISOString(),
      dateRange,
      source: useUploadedData ? 'uploaded' : 'api'
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `dashboard-export-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Handle JSON file upload — supports both standard and TaskTrack formats
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploadError('')
    setUploadSuccess(false)

    // Check file type
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setUploadError('Please upload a valid JSON file')
      return
    }

    // Check file size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size should be less than 5MB')
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result)

        // ── Locate the tasks array ──────────────────────────────────────────
        let tasksArray = null

        if (Array.isArray(jsonData)) {
          // [ { ...task }, ... ]
          tasksArray = jsonData
        } else if (jsonData.tasks && Array.isArray(jsonData.tasks)) {
          // { tasks: [ ... ] }  — standard export AND TaskTrack export format
          tasksArray = jsonData.tasks
        } else if (jsonData.data && Array.isArray(jsonData.data)) {
          // { data: [ ... ] }
          tasksArray = jsonData.data
        } else {
          throw new Error('JSON must contain an array of tasks (top-level array, or { tasks: [] } / { data: [] })')
        }

        // ── Validate & normalize ────────────────────────────────────────────
        const validRaw     = tasksArray.filter(isValidTask)
        const skippedCount = tasksArray.length - validRaw.length

        if (validRaw.length === 0) {
          throw new Error(
            'No valid tasks found. Each task needs at least an id, title, and either a status or completed field.'
          )
        }

        if (skippedCount > 0) {
          console.warn(`${skippedCount} task(s) were skipped due to missing required fields.`)
        }

        // Convert every task to the standard { status } shape
        const normalizedTasks = validRaw.map(normalizeTask)

        setUploadedTasks(normalizedTasks)
        setUploadedFileName(file.name)
        setUploadSuccess(true)
        setUseUploadedData(true)

        // Auto-close modal after 1.5 s
        setTimeout(() => {
          setIsUploadModalOpen(false)
          setUploadSuccess(false)
        }, 1500)

      } catch (err) {
        setUploadError(`Invalid JSON format: ${err.message}`)
        console.error('Upload error:', err)
      }
    }

    reader.onerror = () => {
      setUploadError('Error reading file')
    }

    reader.readAsText(file)
  }

  // Clear uploaded data and revert to API data
  const handleClearUpload = () => {
    setUseUploadedData(false)
    setUploadedTasks([])
    setUploadedFileName('')
    setUploadSuccess(false)
  }

  // Get sample JSON template
  const getSampleTemplate = () => {
    const sample = [
      {
        id: 1,
        title: "Complete project documentation",
        status: "completed",
        priority: "high",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        title: "Review pull requests",
        status: "in-progress",
        priority: "medium",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        title: "Fix UI bugs",
        status: "pending",
        priority: "low",
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
    
    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'tasks-sample.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Calculate data for charts and stats
  const stats         = getAllStats(tasks)
  const statusData    = getStatusDistribution(tasks)
  const priorityData  = getPriorityDistribution(tasks)
  const timelineData  = getTasksOverTime(tasks, dateRange)
  const cumulativeData = getCumulativeTasks(tasks, dateRange)

  // Calculate completion rate for the header
  const completionRate  = stats.completionPercentage || 0
  const completionColor = completionRate >= 75 ? 'text-green-400' : completionRate >= 50 ? 'text-yellow-400' : 'text-blue-400'

  // Date range options
  const dateRanges = ['week', 'month', 'year', 'all']

  if (loading && !useUploadedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <Loader className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"
            />
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 text-lg font-medium"
          >
            Loading dashboard...
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-500 text-sm mt-2"
          >
            Fetching your tasks
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (error && tasks.length === 0 && !useUploadedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="relative">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full bg-red-500/20 blur-xl"
            />
          </div>
          <p className="text-gray-300 text-lg mb-2 font-semibold">Error Loading Tasks</p>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 mb-3"
          >
            Upload JSON File Instead
          </button>
          
          <button
            onClick={handleRefresh}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-200"
          >
            Try Again
          </button>
          
          <p className="text-gray-500 text-xs mt-4">
            Or check <code className="bg-gray-800 px-2 py-1 rounded">.env.local</code> configuration
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Upload Modal */}
          <AnimatePresence>
            {isUploadModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => !uploadSuccess && setIsUploadModalOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-gray-900 rounded-2xl border border-gray-700 p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileJson className="w-6 h-6 text-blue-400" />
                      <h3 className="text-xl font-bold text-white">Upload Task Data</h3>
                    </div>
                    <button
                      onClick={() => !uploadSuccess && setIsUploadModalOpen(false)}
                      className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  
                  {uploadSuccess ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-400" />
                      </div>
                      <p className="text-white font-semibold mb-1">Upload Successful!</p>
                      <p className="text-gray-400 text-sm">{uploadedFileName}</p>
                    </motion.div>
                  ) : (
                    <>
                      <p className="text-gray-400 text-sm mb-6">
                        Upload a JSON file containing your tasks. Supports the standard format
                        (<code className="bg-gray-800 px-1 rounded">status</code> field) as well as
                        the TaskTrack format (<code className="bg-gray-800 px-1 rounded">completed</code> boolean).
                      </p>
                      
                      <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer group">
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="json-upload"
                        />
                        <label
                          htmlFor="json-upload"
                          className="cursor-pointer flex flex-col items-center gap-3"
                        >
                          <div className="p-3 bg-gray-800 rounded-full group-hover:bg-gray-700 transition-colors">
                            <Upload className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Click to upload</p>
                            <p className="text-gray-500 text-xs mt-1">JSON files only (max 5MB)</p>
                          </div>
                        </label>
                      </div>
                      
                      {uploadError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-2"
                        >
                          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                          <p className="text-red-400 text-xs">{uploadError}</p>
                        </motion.div>
                      )}
                      
                      <div className="mt-6 pt-6 border-t border-gray-800">
                        <button
                          onClick={getSampleTemplate}
                          className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Download Sample JSON Template
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Header with Stats */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Activity className="w-8 h-8 text-blue-500" />
                  </motion.div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                    Task Dashboard
                  </h1>
                  {useUploadedData && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                      Custom Data
                    </span>
                  )}
                </div>
                <p className="text-gray-400">Monitor and manage your task progress with real-time insights</p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Data Source Indicator */}
                {useUploadedData && (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center gap-2"
                  >
                    <FileJson className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-purple-300">{uploadedFileName}</span>
                    <button
                      onClick={handleClearUpload}
                      className="ml-1 hover:bg-purple-500/30 rounded p-0.5"
                    >
                      <X className="w-3 h-3 text-purple-400" />
                    </button>
                  </motion.div>
                )}
                
                {/* Completion Rate Badge */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 flex items-center gap-2 ${completionColor}`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{completionRate}% Complete</span>
                </motion.div>
                
                {/* Upload Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Upload JSON</span>
                </motion.button>
                
                {/* Refresh Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="px-4 py-2 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="text-sm">Refresh</span>
                </motion.button>
                
                {/* Export Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExport}
                  className="px-4 py-2 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-all duration-200 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Export</span>
                </motion.button>
              </div>
            </div>
            
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-1.5 rounded-lg bg-gray-800/30 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transition-all duration-200 flex items-center gap-2 text-sm"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </motion.button>
              
              <div className="flex gap-2">
                {dateRanges.map((range) => (
                  <motion.button
                    key={range}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all duration-200 ${
                      dateRange === range
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800/30 text-gray-400 hover:text-white border border-gray-700'
                    }`}
                  >
                    {range}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Expanded Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700"
                >
                  <p className="text-sm text-gray-400">Additional filters coming soon...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Empty State with Upload Option */}
          {tasks.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/50 rounded-xl p-12 mb-8 text-center"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full">
                  <Upload className="w-12 h-12 text-blue-400" />
                </div>
                <p className="text-blue-300 text-xl font-semibold">No tasks to display</p>
                <p className="text-gray-400 max-w-md">
                  Upload a JSON file with your tasks or check your API configuration
                </p>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload JSON File
                  </button>
                  <button
                    onClick={getSampleTemplate}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
                  >
                    Download Sample
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Cards with Animation */}
          {tasks.length > 0 && (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <StatCards stats={stats} />
              </motion.div>

              {/* Charts Grid with Expand/Collapse */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {[
                  { id: 'status',     component: StatusPieChart,          data: statusData,     title: 'Status Distribution' },
                  { id: 'priority',   component: PriorityBarChart,        data: priorityData,   title: 'Priority Distribution' },
                  { id: 'timeline',   component: TasksOverTimeChart,      data: timelineData,   title: 'Tasks Over Time' },
                  { id: 'cumulative', component: CumulativeTasksAreaChart, data: cumulativeData, title: 'Cumulative Tasks' }
                ].map(({ id, component: ChartComponent, data, title }) => (
                  <motion.div
                    key={id}
                    variants={itemVariants}
                    className={`relative ${expandedChart === id ? 'col-span-full' : ''}`}
                  >
                    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold">{title}</h3>
                        <button
                          onClick={() => setExpandedChart(expandedChart === id ? null : id)}
                          className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          {expandedChart === id ? (
                            <Minimize2 className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Maximize2 className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <ChartComponent data={data} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Task Table with Enhanced Styling */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden"
              >
                <TaskTable tasks={tasks} />
              </motion.div>

              {/* Enhanced Footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex items-center justify-between text-gray-500 text-sm"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Dashboard displaying {tasks.length} tasks</span>
                  {useUploadedData && (
                    <span className="text-purple-400">(from uploaded file)</span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  <span>{useUploadedData ? 'Custom data' : 'Real-time data'}</span>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}