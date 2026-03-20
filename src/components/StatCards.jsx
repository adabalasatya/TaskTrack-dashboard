import { CheckCircle2, ListTodo, Clock, Image } from 'lucide-react'

const StatCard = ({ title, value, icon: Icon, color, unit = '' }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
            {unit && <span className="text-gray-400 text-sm">{unit}</span>}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text', 'bg').replace('600', '900')} opacity-20`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  )
}

export const StatCards = ({ stats }) => {
  const cardData = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: ListTodo,
      color: 'text-blue-400'
    },
    {
      title: 'Completion Rate',
      value: stats.completionPercentage,
      unit: '%',
      icon: CheckCircle2,
      color: 'text-green-400'
    },
    {
      title: 'Avg. Completion Time',
      value: stats.averageCompletionTime,
      unit: 'days',
      icon: Clock,
      color: 'text-amber-400'
    },
    {
      title: 'Total Photos',
      value: stats.totalPhotoCount,
      icon: Image,
      color: 'text-purple-400'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cardData.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  )
}
