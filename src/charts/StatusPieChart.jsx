import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(17,20,30,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <p style={{ color: payload[0].payload.color, fontWeight: 600, fontSize: 13 }}>{payload[0].name}</p>
        <p style={{ color: '#e5e7eb', fontSize: 13 }}>{payload[0].value} tasks</p>
      </div>
    )
  }
  return null
}

export const StatusPieChart = ({ data }) => {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'rgba(17,20,30,0.8)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.3)',
      }}
    >
      <h3 className="text-white font-semibold mb-1">Status Distribution</h3>
      <p className="text-gray-600 text-xs mb-5">Task progress by current status</p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="rgba(17,20,30,0.8)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '16px', fontSize: '12px', color: '#9ca3af' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
