import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { Target, Map, Briefcase, TrendingUp, ArrowRight, Upload, BrainCircuit, Zap, CheckCircle } from 'lucide-react'

function StatCard({ icon: Icon, label, value, unit, color, bg, to }) {
  return (
    <Link to={to} className="group relative bg-[#0d0d0d] border border-white/5 rounded-2xl p-5 hover:border-white/15 transition-all duration-200 overflow-hidden">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${bg} blur-3xl scale-150`} />
      <div className="relative">
        <div className={`inline-flex p-2 rounded-lg bg-white/5 mb-3 ${color}`}>
          <Icon size={18} />
        </div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold text-white mt-1 mb-1">
          {value !== undefined && value !== null ? `${value}${unit}` : '--'}
        </p>
        <span className={`text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${color}`}>
          View details <ArrowRight size={10} />
        </span>
      </div>
    </Link>
  )
}

function ProgressRing({ value, size = 80, stroke = 7 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} stroke="white" strokeOpacity="0.05" strokeWidth={stroke} fill="none" />
      <circle
        cx={size/2} cy={size/2} r={r}
        stroke="#FF4D21" strokeWidth={stroke} fill="none"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  )
}

export default function DashboardPage() {
  const { profile } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    api.get('/users/dashboard-stats')
      .then(r => setStats(r.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Skills Added', value: stats?.skillsCount, unit: '', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10', to: '/profile' },
    { label: 'Jobs Applied', value: stats?.jobsMatched, unit: '', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10', to: '/jobs' },
    { label: 'Roadmap Progress', value: stats?.roadmapProgress, unit: '%', icon: Map, color: 'text-[#7F56D9]', bg: 'bg-[#7F56D9]/10', to: '/roadmap' },
    { label: 'Roadmap Steps', value: stats?.totalRoadmapSteps, unit: ` (${stats?.completedRoadmapSteps || 0} done)`, icon: CheckCircle, color: 'text-[#FF4D21]', bg: 'bg-[#FF4D21]/10', to: '/roadmap' },
  ]

  const hasResume = stats?.skillsCount > 0
  const hasRoadmap = stats?.totalRoadmapSteps > 0

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting}, {profile?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Here's your career intelligence overview</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#FF4D21]/10 border border-[#FF4D21]/20 rounded-full px-4 py-2">
          <Zap size={14} className="text-[#FF4D21]" />
          <span className="text-[#FF4D21] text-xs font-semibold">AI Powered</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(c => (
          <StatCard key={c.label} {...c} value={loading ? undefined : c.value} />
        ))}
      </div>

      {/* Main content row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roadmap Progress */}
        <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
            <Map size={16} className="text-[#7F56D9]" /> Roadmap Progress
          </h2>
          {loading ? (
            <div className="h-32 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/20 border-t-[#FF4D21] rounded-full animate-spin" />
            </div>
          ) : hasRoadmap ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="relative">
                <ProgressRing value={stats?.roadmapProgress || 0} size={120} stroke={10} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-3xl font-bold text-white">{stats?.roadmapProgress || 0}%</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">{stats?.completedRoadmapSteps} of {stats?.totalRoadmapSteps} steps done</p>
              <Link to="/roadmap" className="text-[#7F56D9] text-sm hover:underline font-medium">Continue learning →</Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Map size={40} className="text-gray-700 mb-3" />
              <p className="text-gray-500 text-sm">No roadmap yet.</p>
              <Link to="/career-advisor" className="text-[#FF4D21] text-sm mt-2 hover:underline font-medium">Generate with AI →</Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-[#0d0d0d] border border-white/5 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
            <Zap size={16} className="text-[#FF4D21]" /> Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                to: '/profile', icon: Upload, label: 'Upload Resume',
                desc: 'AI extracts your skills instantly',
                accent: 'group-hover:border-[#FF4D21]/50',
                iconColor: 'text-[#FF4D21]',
                done: hasResume
              },
              {
                to: '/skill-gap', icon: Target, label: 'Analyse Skill Gap',
                desc: 'See what you\'re missing for a role',
                accent: 'group-hover:border-orange-500/50',
                iconColor: 'text-orange-400'
              },
              {
                to: '/career-advisor', icon: BrainCircuit, label: 'AI Career Advisor',
                desc: 'Get India-specific job recommendations',
                accent: 'group-hover:border-[#7F56D9]/50',
                iconColor: 'text-[#7F56D9]'
              },
              {
                to: '/jobs', icon: Briefcase, label: 'Explore Jobs',
                desc: 'Browse AI-matched opportunities',
                accent: 'group-hover:border-blue-500/50',
                iconColor: 'text-blue-400'
              },
            ].map(a => (
              <Link key={a.to} to={a.to}
                className={`group flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/3 hover:bg-white/5 transition-all ${a.accent} relative overflow-hidden`}
              >
                {a.done && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle size={12} className="text-green-500" />
                  </div>
                )}
                <div className={`p-2 rounded-lg bg-white/5 ${a.iconColor} shrink-0`}>
                  <a.icon size={16} />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{a.label}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner if no resume */}
      {!loading && !hasResume && (
        <div className="relative bg-gradient-to-r from-[#FF4D21]/20 to-[#7F56D9]/20 border border-white/10 rounded-2xl p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4D21]/10 blur-3xl rounded-full pointer-events-none" />
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">🚀 Start your AI journey</h3>
              <p className="text-gray-400 text-sm max-w-md">Upload your resume to unlock AI-powered skill gap analysis, job matching, and personalized roadmaps.</p>
            </div>
            <Link to="/profile" className="shrink-0 bg-[#FF4D21] hover:bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-[#FF4D21]/30 flex items-center gap-2">
              Upload Resume <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
