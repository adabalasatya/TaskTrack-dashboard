import { useState } from 'react'
import { Dashboard } from './pages/Dashboard'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import { BarChart3, CheckCircle } from 'lucide-react'

export default function App() {
  const [activePage, setActivePage] = useState('tasks')

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-white">TaskTrack</h1>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setActivePage('tasks')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    activePage === 'tasks'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <CheckCircle size={20} />
                  Tasks
                </button>
                
                <button
                  onClick={() => setActivePage('analytics')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    activePage === 'analytics'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <BarChart3 size={20} />
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div>
        {activePage === 'tasks' && <Dashboard />}
        {activePage === 'analytics' && <AnalyticsDashboard />}
      </div>
    </div>
  )
}
