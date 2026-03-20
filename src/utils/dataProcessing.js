import dayjs from 'dayjs'

// Calculate total number of tasks
export const calculateTotalTasks = (tasks) => {
  return tasks.length
}

// Calculate completion percentage
export const calculateCompletionPercentage = (tasks) => {
  if (tasks.length === 0) return 0
  const completed = tasks.filter(task => task.status === 'completed').length
  return Math.round((completed / tasks.length) * 100)
}

// Calculate average completion time in days
export const calculateAverageCompletionTime = (tasks) => {
  const completedTasks = tasks.filter(
    task => task.status === 'completed' && task.completedAt
  )
  
  if (completedTasks.length === 0) return 0
  
  const totalDays = completedTasks.reduce((sum, task) => {
    const created = dayjs(task.createdAt)
    const completed = dayjs(task.completedAt)
    return sum + completed.diff(created, 'days')
  }, 0)
  
  return Math.round(totalDays / completedTasks.length * 10) / 10
}

// Calculate total photo count
export const calculateTotalPhotoCount = (tasks) => {
  return tasks.reduce((sum, task) => {
    const photoCount = typeof task.photos === 'number' ? task.photos : task.photos?.length || 0
    return sum + photoCount
  }, 0)
}

// Get status distribution for pie chart
export const getStatusDistribution = (tasks) => {
  const distribution = {
    pending: 0,
    'in-progress': 0,
    completed: 0
  }
  
  tasks.forEach(task => {
    if (distribution.hasOwnProperty(task.status)) {
      distribution[task.status]++
    }
  })
  
  return [
    { name: 'Pending', value: distribution.pending, color: '#ef4444' },
    { name: 'In Progress', value: distribution['in-progress'], color: '#f59e0b' },
    { name: 'Completed', value: distribution.completed, color: '#10b981' }
  ]
}

// Get priority distribution for bar chart
export const getPriorityDistribution = (tasks) => {
  const distribution = {
    low: 0,
    medium: 0,
    high: 0
  }
  
  tasks.forEach(task => {
    if (distribution.hasOwnProperty(task.priority)) {
      distribution[task.priority]++
    }
  })
  
  return [
    { priority: 'Low', count: distribution.low, fill: '#64748b' },
    { priority: 'Medium', count: distribution.medium, fill: '#f59e0b' },
    { priority: 'High', count: distribution.high, fill: '#ef4444' }
  ]
}

// Get tasks over time (created vs completed per day)
export const getTasksOverTime = (tasks) => {
  const dateMap = new Map()
  
  // Process all tasks
  tasks.forEach(task => {
    const created = dayjs(task.createdAt).format('YYYY-MM-DD')
    const current = dateMap.get(created) || { date: created, created: 0, completed: 0 }
    current.created++
    dateMap.set(created, current)
    
    if (task.status === 'completed' && task.completedAt) {
      const completed = dayjs(task.completedAt).format('YYYY-MM-DD')
      const completedEntry = dateMap.get(completed) || { date: completed, created: 0, completed: 0 }
      completedEntry.completed++
      dateMap.set(completed, completedEntry)
    }
  })
  
  // Convert to sorted array
  return Array.from(dateMap.values())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(entry => ({
      date: dayjs(entry.date).format('MMM DD'),
      created: entry.created,
      completed: entry.completed
    }))
}

// Get cumulative tasks over time
export const getCumulativeTasks = (tasks) => {
  if (tasks.length === 0) return []
  
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.createdAt) - new Date(b.createdAt)
  )
  
  const cumulativeData = []
  let cumulative = 0
  const processedDates = new Set()
  
  sortedTasks.forEach(task => {
    const dateStr = dayjs(task.createdAt).format('YYYY-MM-DD')
    
    if (!processedDates.has(dateStr)) {
      cumulative = sortedTasks.filter(t => 
        dayjs(t.createdAt).format('YYYY-MM-DD') <= dateStr
      ).length
      
      cumulativeData.push({
        date: dayjs(dateStr).format('MMM DD'),
        total: cumulative
      })
      
      processedDates.add(dateStr)
    }
  })
  
  return cumulativeData.length > 0 ? cumulativeData : [
    { date: dayjs().format('MMM DD'), total: tasks.length }
  ]
}

// Get all stats at once
export const getAllStats = (tasks) => {
  return {
    totalTasks: calculateTotalTasks(tasks),
    completionPercentage: calculateCompletionPercentage(tasks),
    averageCompletionTime: calculateAverageCompletionTime(tasks),
    totalPhotoCount: calculateTotalPhotoCount(tasks)
  }
}

// Format date for display
export const formatDate = (dateString) => {
  return dayjs(dateString).format('MMM DD, YYYY')
}

// Format date and time
export const formatDateTime = (dateString) => {
  return dayjs(dateString).format('MMM DD, YYYY HH:mm')
}

// Get status badge color
export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-red-900 text-red-100',
    'in-progress': 'bg-amber-900 text-amber-100',
    completed: 'bg-green-900 text-green-100'
  }
  return colors[status] || 'bg-gray-700 text-gray-100'
}

// Get priority badge color
export const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-slate-700 text-slate-100',
    medium: 'bg-amber-900 text-amber-100',
    high: 'bg-red-900 text-red-100'
  }
  return colors[priority] || 'bg-gray-700 text-gray-100'
}
