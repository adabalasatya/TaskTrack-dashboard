import React, { useState } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'
import { StatusPieChart } from '../charts/StatusPieChart'
import { PriorityBarChart } from '../charts/PriorityBarChart'
import { TasksOverTimeChart } from '../charts/TasksOverTimeChart'
import { CumulativeTasksAreaChart } from '../charts/CumulativeTasksAreaChart'
import { Calendar, RefreshCw, AlertCircle } from 'lucide-react'

const AnalyticsDashboard = () => {
  const [days, setDays] = useState(30)
  const { data, loading, error, backendHealthy, refetch } = useAnalytics(days)

  const handleDaysChange = (e) => {
    setDays(parseInt(e.target.value))
  }

  const handleRefresh = () => {
    refetch()
  }

  if (!backendHealthy) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900 border border-red-700 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-lg font-semibold text-red-200 mb-2">
                Backend Analytics Server Not Running
              </h2>
              <p className="text-red-300 mb-4">
                The analytics backend server is not available. Make sure to start it first:
              </p>
              <code className="bg-red-950 text-red-100 px-4 py-2 rounded block text-sm mb-4">
                cd backend && npm install && npm run dev
              </code>
              <p className="text-red-300 text-sm">
                The backend server should run on http://localhost:3001
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Mixpanel analytics and insights</p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
              <Calendar size={18} className="text-gray-400" />
              <select
                value={days}
                onChange={handleDaysChange}
                className="bg-gray-800 text-white text-sm border-none outline-none"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 rounded-lg p-4 text-red-200">
            <p className="font-semibold mb-1">Error loading analytics</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && !data ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading analytics data...</p>
            </div>
          </div>
        ) : data ? (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Total Events</p>
                <h3 className="text-3xl font-bold text-white">
                  {data.stats?.totalEvents?.toLocaleString() || 0}
                </h3>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Tasks Created</p>
                <h3 className="text-3xl font-bold text-blue-400">
                  {data.stats?.taskCreatedEvents?.toLocaleString() || 0}
                </h3>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Tasks Completed</p>
                <h3 className="text-3xl font-bold text-green-400">
                  {data.stats?.taskCompletedEvents?.toLocaleString() || 0}
                </h3>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Completion Rate</p>
                <h3 className="text-3xl font-bold text-amber-400">
                  {data.stats?.completionRate || 0}%
                </h3>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              {data.chartData?.statusDistribution && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Status Distribution</h3>
                  <StatusPieChart data={data.chartData.statusDistribution} />
                </div>
              )}

              {/* Event Counts */}
              {data.chartData?.eventCounts && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Event Types</h3>
                  <PriorityBarChart data={data.chartData.eventCounts} />
                </div>
              )}

              {/* Daily Comparison */}
              {data.chartData?.dailyComparison && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Daily Activity</h3>
                  <TasksOverTimeChart data={data.chartData.dailyComparison} />
                </div>
              )}

              {/* Cumulative Events */}
              {data.chartData?.statusDistribution && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Cumulative Events</h3>
                  <CumulativeTasksAreaChart data={data.chartData.statusDistribution} />
                </div>
              )}
            </div>

            {/* Metrics Footer */}
            {data.metrics && (
              <div className="mt-8 bg-gray-800 rounded-lg p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Avg Completion Time</p>
                    <p className="text-2xl font-bold text-white">
                      {data.metrics.avgCompletionTime || 0} days
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Active Users</p>
                    <p className="text-2xl font-bold text-white">
                      {data.stats?.activeUsers || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Last Updated</p>
                    <p className="text-sm text-gray-300">
                      {data.metrics.lastUpdated
                        ? new Date(data.metrics.lastUpdated).toLocaleTimeString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <p className="text-sm text-green-400 font-semibold">● Connected</p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No analytics data available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsDashboard
