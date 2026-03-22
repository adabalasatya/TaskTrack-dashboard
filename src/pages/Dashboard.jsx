import { Loader2, AlertCircle, TrendingUp, RefreshCw } from 'lucide-react'
import { StatCards, TaskTable, FileUpload } from '../components'
import { StatusPieChart, PriorityBarChart, TasksOverTimeChart, CumulativeTasksAreaChart } from '../charts'
import { useTasks } from '../hooks/useTasks'
import {
  getAllStats,
  getStatusDistribution,
  getPriorityDistribution,
  getTasksOverTime,
  getCumulativeTasks
} from '../utils/dataProcessing'

export const Dashboard = () => {
  const { tasks, loading, error, setTasks } = useTasks()

  const stats = getAllStats(tasks)
  const statusData = getStatusDistribution(tasks)
  const priorityData = getPriorityDistribution(tasks)
  const timelineData = getTasksOverTime(tasks)
  const cumulativeData = getCumulativeTasks(tasks)

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
          </div>
          <p className="text-gray-400 font-medium">Loading tasks…</p>
          <p className="text-gray-600 text-sm mt-1">Fetching your data</p>
        </div>
      </div>
    )
  }

  /* ─── Error ─── */
  if (error && tasks.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="max-w-sm w-full rounded-2xl p-8 text-center"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(239,68,68,0.12)' }}>
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-white font-semibold mb-2">Unable to Load Tasks</h2>
          <p className="text-red-300/80 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  /* ─── Dashboard ─── */
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8" style={{ background: '#0a0c12' }}>
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))', border: '1px solid rgba(99,102,241,0.25)' }}>
                <TrendingUp className="w-4.5 h-4.5 text-indigo-400" size={18} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Task Overview
              </h1>
            </div>
            <p className="text-gray-600 text-sm pl-12">
              {tasks.length} tasks · updated just now
            </p>
          </div>

          {/* Header Controls */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <FileUpload onDataLoaded={setTasks} />
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <RefreshCw size={13} className="text-gray-500" />
              <span className="text-gray-500">{stats.completionPercentage}% complete</span>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <StatCards stats={stats} />

        {/* Divider label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-600">Analytics</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <StatusPieChart data={statusData} />
          <PriorityBarChart data={priorityData} />
          <TasksOverTimeChart data={timelineData} />
          <CumulativeTasksAreaChart data={cumulativeData} />
        </div>

        {/* Divider label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-600">All Tasks</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>

        {/* Task Table */}
        <TaskTable tasks={tasks} />

        {/* Footer */}
        <p className="mt-8 text-center text-gray-700 text-xs">
          TaskTrack · {tasks.length} tasks loaded
        </p>
      </div>
    </div>
  )
}
