import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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
        <p style={{ color: '#818cf8', fontWeight: 600, fontSize: 13 }}>{payload[0]?.value} total tasks</p>
      </div>
    )
  }
  return null
}

export const CumulativeTasksAreaChart = ({ data }) => {
  return (
    <div
      className="rounded-2xl p-6 h-full flex flex-col"
      style={{
        background: 'rgba(17,20,30,0.8)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.3)',
      }}
    >
      <h3 className="text-white font-semibold mb-1">Cumulative Growth</h3>
      <p className="text-gray-600 text-xs mb-5">Total tasks accumulated over time</p>
      
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
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
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="stepAfter"
              dataKey="total"
              stroke="#818cf8"
              strokeWidth={4}
              fill="url(#growthGradient)"
              activeDot={{ r: 6, fill: '#818cf8', strokeWidth: 0, stroke: '#fff' }}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
