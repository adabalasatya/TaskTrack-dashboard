import { useState, useMemo } from 'react'
import { Search, ChevronUp, ChevronDown, Download } from 'lucide-react'
import { formatDate, getStatusColor, getPriorityColor } from '../utils/dataProcessing'
import { taskService } from '../services/taskService'
import { exportToCSV } from '../utils/exportUtils'
import { trackSearch, trackFilter, trackSort, trackExport, trackPagination } from '../services/analytics'

const ITEMS_PER_PAGE = 10

export const TaskTable = ({ tasks }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)

  // Apply filters and search
  const filteredTasks = useMemo(() => {
    let result = tasks
    
    if (searchTerm) {
      result = taskService.searchTasks(result, searchTerm)
    }
    
    if (statusFilter) {
      result = taskService.filterByStatus(result, statusFilter)
    }
    
    if (priorityFilter) {
      result = taskService.filterByPriority(result, priorityFilter)
    }
    
    return result
  }, [tasks, searchTerm, statusFilter, priorityFilter])

  // Apply sorting
  const sortedTasks = useMemo(() => {
    return taskService.sortTasks(filteredTasks, sortBy, sortOrder)
  }, [filteredTasks, sortBy, sortOrder])

  // Paginate
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedTasks.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [sortedTasks, currentPage])

  const totalPages = Math.ceil(sortedTasks.length / ITEMS_PER_PAGE)

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setCurrentPage(1)
    trackSort(field, sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <div className="w-4 h-4" />
    return sortOrder === 'asc' 
      ? <ChevronUp className="w-4 h-4" />
      : <ChevronDown className="w-4 h-4" />
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
      {/* Header with controls */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Tasks</h3>
          <button
            onClick={() => {
              exportToCSV(sortedTasks, 'tasks.csv')
              trackExport(sortedTasks.length)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
                trackSearch(e.target.value, 0)
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
              trackFilter('status', e.target.value, 0)
            }}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value)
              setCurrentPage(1)
              trackFilter('priority', e.target.value, 0)
            }}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Results count */}
          <div className="flex items-center justify-end text-gray-400 text-sm">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {paginatedTasks.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('title')}
                    className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                  >
                    <span className="text-sm font-semibold text-white">Title</span>
                    <SortIcon field="title" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                  >
                    <span className="text-sm font-semibold text-white">Status</span>
                    <SortIcon field="status" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('priority')}
                    className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                  >
                    <span className="text-sm font-semibold text-white">Priority</span>
                    <SortIcon field="priority" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                  >
                    <span className="text-sm font-semibold text-white">Created</span>
                    <SortIcon field="createdAt" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Completed</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-white">Photos</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTasks.map((task, index) => (
                <tr
                  key={task.id}
                  className={`border-b border-gray-700 hover:bg-gray-700 transition-colors ${
                    index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium truncate">{task.title}</p>
                      <p className="text-gray-400 text-sm truncate">{task.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                      {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{formatDate(task.createdAt)}</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">
                    {task.completedAt ? formatDate(task.completedAt) : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1 bg-blue-900 text-blue-100 rounded-full text-xs font-semibold">
                      {typeof task.photos === 'number' ? task.photos : task.photos?.length || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-400">
            <p>No tasks found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between bg-gray-750">
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setCurrentPage(Math.max(1, currentPage - 1))
                trackPagination(Math.max(1, currentPage - 1), ITEMS_PER_PAGE)
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => {
                setCurrentPage(Math.min(totalPages, currentPage + 1))
                trackPagination(Math.min(totalPages, currentPage + 1), ITEMS_PER_PAGE)
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
