import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'

export const PriorityBarChart = ({ data }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Tasks by Priority</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="priority" 
            stroke="#9ca3af"
            style={{ fontSize: '14px' }}
          />
          <YAxis stroke="#9ca3af" style={{ fontSize: '14px' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
            labelStyle={{ color: '#fff' }}
            formatter={(value) => [value, 'Count']}
          />
          <Legend contentStyle={{ color: '#e5e7eb', paddingTop: '20px' }} />
          <Bar dataKey="count" name="Tasks" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
