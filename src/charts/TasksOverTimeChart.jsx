import { ComposedChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: '#818cf8' }} />
          <p style={{ color: '#e5e7eb', fontWeight: 600, fontSize: 13 }}>{payload[0]?.value} created</p>
        </div>
        {payload[1] && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#34d399' }} />
            <p style={{ color: '#e5e7eb', fontWeight: 600, fontSize: 13 }}>{payload[1].value} completed</p>
          </div>
        )}
      </div>
    )
  }
  return null
}

export const TasksOverTimeChart = ({ data }) => {
  return (
    <div
      className="rounded-2xl p-6 h-full flex flex-col"
      style={{
        background: 'rgba(17,20,30,0.8)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.3)',
      }}
    >
      <h3 className="text-white font-semibold mb-1">Tasks Over Time</h3>
      <p className="text-gray-600 text-xs mb-5">Daily task creation and completion trends</p>
      
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={30}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            
            <Bar
              dataKey="created"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#completedGradient)"
              activeDot={{ r: 6, fill: '#34d399', strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
