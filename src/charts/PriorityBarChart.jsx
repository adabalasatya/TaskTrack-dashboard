import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#6b7280',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(17,20,30,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <p style={{ color: '#9ca3af', fontSize: 12, marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#e5e7eb', fontWeight: 600, fontSize: 13 }}>{payload[0].value} tasks</p>
      </div>
    )
  }
  return null
}

export const PriorityBarChart = ({ data }) => {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'rgba(17,20,30,0.8)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.3)',
      }}
    >
      <h3 className="text-white font-semibold mb-1">Priority Breakdown</h3>
      <p className="text-gray-600 text-xs mb-5">Distribution of tasks by priority level</p>

      {/* Empty State Overlay */}
      {(!data || data.every(d => d.value === 0)) ? (
        <div className="flex flex-col items-center justify-center h-[280px]">
          <span className="text-gray-500 font-medium text-lg">N/A</span>
          <span className="text-gray-600 text-xs mt-1">No priority data available</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PRIORITY_COLORS[entry.name?.toLowerCase()] || '#6366f1'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>
  )
}
