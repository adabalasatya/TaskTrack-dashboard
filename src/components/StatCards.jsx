import { CheckCircle2, ListTodo, Clock, Camera } from 'lucide-react'

const CARDS = [
  {
    key:      'totalTasks',
    label:    'Total Tasks',
    unit:     '',
    Icon:     ListTodo,
    color:    '#818cf8',
    gradient: 'linear-gradient(135deg,#6366f1,#818cf8)',
    glow:     'rgba(99,102,241,0.12)',
    border:   'rgba(99,102,241,0.2)',
  },
  {
    key:      'completionPercentage',
    label:    'Completion Rate',
    unit:     '%',
    Icon:     CheckCircle2,
    color:    '#34d399',
    gradient: 'linear-gradient(135deg,#059669,#34d399)',
    glow:     'rgba(16,185,129,0.12)',
    border:   'rgba(16,185,129,0.2)',
    showBar:  true,
  },
  {
    key:      'averageCompletionTime',
    label:    'Avg. Completion',
    unit:     'days',
    Icon:     Clock,
    color:    '#fbbf24',
    gradient: 'linear-gradient(135deg,#d97706,#fbbf24)',
    glow:     'rgba(245,158,11,0.12)',
    border:   'rgba(245,158,11,0.2)',
  },
  {
    key:      'totalPhotoCount',
    label:    'Total Photos',
    unit:     '',
    Icon:     Camera,
    color:    '#c084fc',
    gradient: 'linear-gradient(135deg,#9333ea,#c084fc)',
    glow:     'rgba(168,85,247,0.12)',
    border:   'rgba(168,85,247,0.2)',
  },
]

const StatCard = ({ card, value }) => {
  const { label, unit, Icon, color, gradient, glow, border, showBar } = card
  return (
    <div
      className="rounded-2xl p-5 transition-all duration-300 select-none"
      style={{ background: 'rgba(15,17,26,0.9)', border: `1px solid ${border}`, boxShadow: `0 4px 20px ${glow}` }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 10px 32px ${glow}` }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 4px 20px ${glow}` }}
    >
      {/* Icon */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
        style={{ background: gradient }}>
        <Icon size={16} className="text-white" />
      </div>

      {/* Label */}
      <p className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>

      {/* Value */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold" style={{ color }}>{value ?? '—'}</span>
        {unit && <span className="text-gray-600 text-sm">{unit}</span>}
      </div>

      {/* Progress bar (completion card only) */}
      {showBar && (
        <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full" style={{ width: `${Math.min(100, value || 0)}%`, background: gradient, transition: 'width 0.8s ease' }} />
        </div>
      )}
    </div>
  )
}

export const StatCards = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {CARDS.map(card => (
      <StatCard key={card.key} card={card} value={stats[card.key]} />
    ))}
  </div>
)
