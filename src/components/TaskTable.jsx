import { useState, useMemo } from 'react'
import { Search, ChevronUp, ChevronDown, Download, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { formatDate, getStatusColor, getPriorityColor } from '../utils/dataProcessing'
import { taskService } from '../services/taskService'
import { exportToCSV } from '../utils/exportUtils'

// Default items per page
const DEFAULT_ITEMS_PER_PAGE = 10

/* ─── Badge helpers ─── */
const STATUS_STYLES = {
  completed:    { bg: 'rgba(16,185,129,0.1)',  color: '#34d399', border: 'rgba(16,185,129,0.2)'  },
  pending:      { bg: 'rgba(245,158,11,0.1)',  color: '#fbbf24', border: 'rgba(245,158,11,0.2)'  },
}
const PRIORITY_STYLES = {
  high:   { bg: 'rgba(239,68,68,0.1)',   color: '#f87171', border: 'rgba(239,68,68,0.2)'   },
  medium: { bg: 'rgba(245,158,11,0.1)',  color: '#fbbf24', border: 'rgba(245,158,11,0.2)'  },
  low:    { bg: 'rgba(107,114,128,0.1)', color: '#9ca3af', border: 'rgba(107,114,128,0.2)' },
}

const Badge = ({ text, styles }) => (
  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
    style={{ background: styles.bg, color: styles.color, border: `1px solid ${styles.border}` }}>
    {text}
  </span>
)

const GLASS = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  color: '#d1d5db',
}

export const TaskTable = ({ tasks }) => {
  const [searchTerm,    setSearchTerm]    = useState('')
  const [statusFilter,  setStatusFilter]  = useState('')
  const [priorityFilter,setPriorityFilter]= useState('')
  const [sortBy,        setSortBy]        = useState('createdAt')
  const [sortOrder,     setSortOrder]     = useState('desc')
  const [currentPage,   setCurrentPage]   = useState(1)
  const [itemsPerPage,  setItemsPerPage]  = useState(DEFAULT_ITEMS_PER_PAGE)

  const filtered = useMemo(() => {
    let r = tasks
    if (searchTerm)    r = taskService.searchTasks(r, searchTerm)
    if (statusFilter)  r = taskService.filterByStatus(r, statusFilter)
    if (priorityFilter)r = taskService.filterByPriority(r, priorityFilter)
    return r
  }, [tasks, searchTerm, statusFilter, priorityFilter])

  const sorted    = useMemo(() => taskService.sortTasks(filtered, sortBy, sortOrder), [filtered, sortBy, sortOrder])
  const paginated = useMemo(() => sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [sorted, currentPage, itemsPerPage])
  const totalPages = Math.ceil(sorted.length / itemsPerPage)

  const handleSort = (field) => {
    setSortBy(field)
    setSortOrder(sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc')
    setCurrentPage(1)
  }

  const SortIcon = ({ field }) =>
    sortBy !== field
      ? <ChevronUp className="w-3 h-3 opacity-20" />
      : sortOrder === 'asc'
        ? <ChevronUp className="w-3 h-3 text-indigo-400" />
        : <ChevronDown className="w-3 h-3 text-indigo-400" />

  const cols = [
    { label: 'Task',      field: 'title'     },
    { label: 'Status',    field: 'completed' },
    { label: 'Priority',  field: 'priority'  },
    { label: 'Created',   field: 'createdAt' },
    { label: 'Location',  field: null        },
    { label: 'Photos',    field: null        },
  ]

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(15,17,26,0.9)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>

      {/* ── Controls ── */}
      <div className="px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Filter size={14} className="text-indigo-400" />
            <span className="text-white text-sm font-semibold">Tasks</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
              {filtered.length}
            </span>
          </div>
          <button
            onClick={() => exportToCSV(sorted, 'tasks.csv')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow: '0 2px 14px rgba(99,102,241,0.25)' }}>
            <Download size={13} />
            Export
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
            <input type="text" placeholder="Search tasks…" value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              className="w-full pl-8 pr-3 py-2 text-sm placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition"
              style={GLASS} />
          </div>

          {/* Status */}
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1) }}
            className="px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition"
            style={GLASS}>
            <option value="" style={{ background: '#0f1117' }}>All Statuses</option>
            <option value="pending"     style={{ background: '#0f1117' }}>Pending</option>
            <option value="completed"   style={{ background: '#0f1117' }}>Completed</option>
          </select>

          {/* Priority */}
          <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setCurrentPage(1) }}
            className="px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition"
            style={GLASS}>
            <option value="" style={{ background: '#0f1117' }}>All Priorities</option>
            <option value="low"    style={{ background: '#0f1117' }}>Low</option>
            <option value="medium" style={{ background: '#0f1117' }}>Medium</option>
            <option value="high"   style={{ background: '#0f1117' }}>High</option>
          </select>

          {/* Items Per Page */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-xs font-medium whitespace-nowrap">Show:</span>
            <select 
              value={itemsPerPage} 
              onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1) }}
              className="px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition w-full"
              style={GLASS}>
              <option value="10" style={{ background: '#0f1117' }}>10 records</option>
              <option value="20" style={{ background: '#0f1117' }}>20 records</option>
              <option value="50" style={{ background: '#0f1117' }}>50 records</option>
              <option value="100" style={{ background: '#0f1117' }}>100 records</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        {paginated.length > 0 ? (
          <table className="w-full">
            <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <tr>
                {cols.map(({ label, field }) => (
                  <th key={label} className="px-5 py-3 text-left">
                    {field ? (
                      <button onClick={() => handleSort(field)}
                        className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-600 hover:text-gray-400 transition-colors">
                        {label}<SortIcon field={field} />
                      </button>
                    ) : (
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">{label}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((task, i) => (
                <tr key={task.id}
                  className="transition-all duration-150 group cursor-default"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>

                  <td className="px-5 py-3.5">
                    <p className="text-gray-200 text-sm font-medium truncate max-w-[220px]">{task.title}</p>
                    {task.description && (
                      <p className="text-gray-600 text-xs truncate max-w-[220px] mt-0.5">{task.description}</p>
                    )}
                  </td>

                  <td className="px-5 py-3.5">
                    {task.completed ? (
                      <Badge text="Completed" styles={STATUS_STYLES.completed} />
                    ) : (
                      <Badge text="Pending" styles={STATUS_STYLES.pending} />
                    )}
                  </td>

                  <td className="px-5 py-3.5">
                    <Badge text={task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1) || 'None'}
                           styles={PRIORITY_STYLES[task.priority?.toLowerCase()] || PRIORITY_STYLES.low} />
                  </td>

                  <td className="px-5 py-3.5 text-gray-500 text-xs">{formatDate(task.createdAt)}</td>

                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {task.location?.address ? (
                      <span className="truncate max-w-[150px] inline-block" title={task.location.address}>
                        {task.location.address.split(',')[0]}
                      </span>
                    ) : <span className="text-gray-700">—</span>}
                  </td>

                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-semibold"
                      style={{ background: 'rgba(168,85,247,0.1)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.18)' }}>
                      {typeof task.photos === 'number' ? task.photos : task.photos?.length || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <Search className="w-5 h-5 text-gray-700" />
            </div>
            <p className="text-gray-500 text-sm font-medium">No tasks found</p>
            <p className="text-gray-700 text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="px-6 py-3.5 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
          <span className="text-gray-600 text-xs">Page <span className="text-gray-400">{currentPage}</span> / {totalPages}</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5"
              style={{ color: '#9ca3af' }}>
              <ChevronLeft size={13} /> Prev
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5"
              style={{ color: '#9ca3af' }}>
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
