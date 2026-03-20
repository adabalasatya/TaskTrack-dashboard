import { useEffect } from 'react'
import { Loader, AlertCircle, Activity } from 'lucide-react'
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

export const Dashboard = () => {
  const { tasks, loading, error } = useTasks()

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

  // Calculate data for charts and stats
  const stats = getAllStats(tasks)
  const statusData = getStatusDistribution(tasks)
  const priorityData = getPriorityDistribution(tasks)
  const timelineData = getTasksOverTime(tasks)
  const cumulativeData = getCumulativeTasks(tasks)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error && tasks.length === 0) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT_TASKS || '/tasks'
    
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-300 text-lg mb-2">Error Loading Tasks</p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          
          <div className="bg-gray-800 rounded-lg p-4 text-left text-xs text-gray-400 mb-4">
            <p className="font-mono mb-2">API Configuration:</p>
            <p className="break-all">Base: {apiBaseUrl}</p>
            <p className="break-all">Endpoint: {apiEndpoint}</p>
            <p className="break-all">Full URL: {apiBaseUrl}{apiEndpoint}</p>
          </div>
          
          <p className="text-gray-500 text-xs">
            Check <code className="bg-gray-800 px-2 py-1 rounded">.env.local</code> file or 
            see <code className="bg-gray-800 px-2 py-1 rounded">API_SETUP.md</code> for configuration help.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Task Dashboard</h1>
          </div>
          <p className="text-gray-400">Monitor and manage your task progress</p>
        </div>

        {/* Empty State */}
        {tasks.length === 0 && !loading && (
          <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-6 mb-8">
            <p className="text-blue-300 text-center">
              No tasks loaded yet. Check your API configuration in <code className="bg-blue-900 px-2 py-1 rounded">.env.local</code> or see <code className="bg-blue-900 px-2 py-1 rounded">API_SETUP.md</code> for details.
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <StatCards stats={stats} />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StatusPieChart data={statusData} />
          <PriorityBarChart data={priorityData} />
          <TasksOverTimeChart data={timelineData} />
          <CumulativeTasksAreaChart data={cumulativeData} />
        </div>

        {/* Task Table */}
        <TaskTable tasks={tasks} />

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Dashboard displaying {tasks.length} tasks</p>
        </div>
      </div>
    </div>
  )
}
