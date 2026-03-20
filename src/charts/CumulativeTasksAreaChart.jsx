import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export const CumulativeTasksAreaChart = ({ data }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Cumulative Tasks Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af"
            style={{ fontSize: '14px' }}
          />
          <YAxis stroke="#9ca3af" style={{ fontSize: '14px' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend contentStyle={{ color: '#e5e7eb', paddingTop: '20px' }} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#8b5cf6"
            fillOpacity={1}
            fill="url(#colorTotal)"
            name="Total Tasks"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
