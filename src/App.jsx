import { Dashboard } from './pages/Dashboard'
import { Zap } from 'lucide-react'

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0c12' }}>
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(10,12,18,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}
            >
              <Zap size={15} className="text-white" strokeWidth={2.5} />
            </div>
            <span
              className="text-lg font-bold tracking-tight"
              style={{
                background: 'linear-gradient(90deg, #c7d2fe 0%, #e9d5ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TaskTrack
            </span>
          </div>

          {/* Live badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">Live</span>
          </div>
        </div>
      </nav>

      <Dashboard />
    </div>
  )
}
