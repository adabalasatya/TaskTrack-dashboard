import { formatDate } from './dataProcessing'

export const exportToCSV = (tasks, filename = 'tasks.csv') => {
  // Define CSV headers
  const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Created At', 'Completed At', 'Photos']

  // Convert tasks to CSV rows
  const rows = tasks.map(task => [
    task.id,
    `"${task.title}"`, // Quote title in case it contains commas
    `"${task.description}"`,
    task.status,
    task.priority,
    formatDate(task.createdAt),
    task.completedAt ? formatDate(task.completedAt) : '-',
    typeof task.photos === 'number' ? task.photos : task.photos?.length || 0
  ])

  // Combine headers and rows
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
