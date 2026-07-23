import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import {
  Target, Map, Briefcase, TrendingUp, ArrowRight,
  Upload, BrainCircuit, CheckCircle, Sparkles, Zap, Activity
} from 'lucide-react'

/* ── Stat Card ── */
function StatCard({ icon: Icon, label, value, unit, accentColor, glowColor, to }) {
  return (
    <Link to={to} className="glass-card group p-5 relative overflow-hidden block" style={{
      transition: 'all 0.2s ease',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${accentColor}40`
        e.currentTarget.style.boxShadow = `0 8px 40px rgba(0,0,0,0.5), 0 0 20px ${glowColor}25`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)'
      }}
    >
      {/* Hover glow bg */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at top right, ${glowColor}10 0%, transparent 70%)` }} />

      <div className="relative">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{
          background: `${accentColor}15`,
          border: `1px solid ${accentColor}30`,
        }}>
          <Icon size={18} style={{ color: accentColor }} />
        </div>
        <p className="label-caps mb-1" style={{ color: '#958da1' }}>{label}</p>
        <p className="font-display font-bold text-3xl" style={{ color: '#dae2fd' }}>
          {value !== undefined && value !== null ? `${value}${unit}` : '--'}
        </p>
        <span className="text-xs font-medium flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: accentColor }}>
          View details <ArrowRight size={10} />
        </span>
      </div>
    </Link>
  )
}

/* ── Progress Ring ── */
function ProgressRing({ value, size = 120, stroke = 10 }) {
  const r      = (size - stroke) / 2
  const circ   = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size/2} cy={size/2} r={r}
        stroke="url(#aetherGrad)" strokeWidth={stroke} fill="none"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s ease' }}
      />
      <defs>
        <linearGradient id="aetherGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4cd7f6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const quickActions = [
  {
    to: '/profile',       icon: Upload,      label: 'Upload Resume',
    desc: 'AI extracts your skills instantly',
    accent: '#7c3aed', glow: 'rgba(124,58,237,0.2)', chip: 'Step 1',
  },
  {
    to: '/skill-gap',     icon: Target,      label: 'Skill Gap Analysis',
    desc: 'See exactly what\'s missing for your target role',
    accent: '#4cd7f6', glow: 'rgba(76,215,246,0.15)', chip: 'Step 2',
  },
  {
    to: '/career-advisor',icon: BrainCircuit,label: 'AI Career Advisor',
    desc: 'India-specific job recommendations',
    accent: '#0566d9', glow: 'rgba(5,102,217,0.15)', chip: 'AI',
  },
  {
    to: '/jobs',          icon: Briefcase,   label: 'Explore Jobs',
    desc: 'Browse AI-matched opportunities',
    accent: '#d2bbff', glow: 'rgba(210,187,255,0.1)', chip: 'Live',
  },
]

export default function DashboardPage() {
  const { profile } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    api.get('/users/dashboard-stats')
      .then(r => setStats(r.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Skills Added',     value: stats?.skillsCount,           unit: '',  icon: TrendingUp,  accentColor: '#4cd7f6', glowColor: 'rgba(76,215,246,0.3)',   to: '/profile' },
    { label: 'Jobs Matched',     value: stats?.jobsMatched,           unit: '',  icon: Briefcase,   accentColor: '#adc6ff', glowColor: 'rgba(173,198,255,0.2)',  to: '/jobs' },
    { label: 'Roadmap Progress', value: stats?.roadmapProgress,       unit: '%', icon: Map,         accentColor: '#d2bbff', glowColor: 'rgba(210,187,255,0.25)', to: '/roadmap' },
    { label: 'Steps Completed',  value: stats?.completedRoadmapSteps, unit: ` / ${stats?.totalRoadmapSteps || 0}`, icon: CheckCircle, accentColor: '#7c3aed', glowColor: 'rgba(124,58,237,0.3)', to: '/roadmap' },
  ]

  const hasResume  = stats?.skillsCount > 0
  const hasRoadmap = stats?.totalRoadmapSteps > 0

  return (
    <div className="space-y-7 max-w-7xl animate-fade-in">

      {/* ── Greeting Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: '#dae2fd' }}>
            {greeting}, {profile?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#958da1' }}>
            Here's your career intelligence overview
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full" style={{
          background: 'rgba(124,58,237,0.1)',
          border: '1px solid rgba(124,58,237,0.25)',
        }}>
          <div className="status-dot" />
          <span className="label-caps" style={{ color: '#d2bbff', fontSize: '10px' }}>AI Active</span>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(c => (
          <StatCard key={c.label} {...c} value={loading ? undefined : c.value} />
        ))}
      </div>

      {/* ── Main Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Roadmap Progress Ring */}
        <div className="glass-card p-6 flex flex-col">
          <h2 className="font-display font-semibold text-base flex items-center gap-2 mb-5" style={{ color: '#dae2fd' }}>
            <Map size={16} style={{ color: '#d2bbff' }} /> Roadmap Progress
          </h2>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{
                borderColor: 'rgba(124,58,237,0.2)',
                borderTopColor: '#7c3aed',
              }} />
            </div>
          ) : hasRoadmap ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="relative">
                <ProgressRing value={stats?.roadmapProgress || 0} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl" style={{ color: '#dae2fd' }}>
                      {stats?.roadmapProgress || 0}%
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-center" style={{ color: '#958da1' }}>
                {stats?.completedRoadmapSteps} of {stats?.totalRoadmapSteps} steps done
              </p>
              <Link to="/roadmap" className="btn-outline text-xs px-4 py-2 mt-1">
                Continue learning <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.2)',
              }}>
                <Map size={24} style={{ color: '#7c3aed' }} />
              </div>
              <p className="text-sm" style={{ color: '#958da1' }}>No roadmap generated yet.</p>
              <Link to="/career-advisor" className="btn-glow text-xs px-4 py-2">
                <Sparkles size={12} /> Generate with AI
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="font-display font-semibold text-base flex items-center gap-2 mb-5" style={{ color: '#dae2fd' }}>
            <Zap size={16} style={{ color: '#4cd7f6' }} /> Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map(a => (
              <Link key={a.to} to={a.to}
                className="group flex items-start gap-3 p-4 rounded-xl relative overflow-hidden transition-all duration-200"
                style={{ background: 'rgba(34,42,61,0.5)', border: '1px solid rgba(74,68,85,0.35)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${a.accent}40`
                  e.currentTarget.style.background = `${a.glow}`
                  e.currentTarget.style.boxShadow = `0 0 16px ${a.glow}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(74,68,85,0.35)'
                  e.currentTarget.style.background = 'rgba(34,42,61,0.5)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{
                  background: `${a.accent}15`, border: `1px solid ${a.accent}30`,
                }}>
                  <a.icon size={16} style={{ color: a.accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#dae2fd' }}>{a.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#958da1' }}>{a.desc}</p>
                </div>
                <span className="ai-chip shrink-0 self-start">{a.chip}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Skill Velocity placeholder ── */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-base flex items-center gap-2" style={{ color: '#dae2fd' }}>
            <Activity size={16} style={{ color: '#4cd7f6' }} /> Skill Velocity
          </h2>
          <span className="ai-chip ai-chip-cyan">Month-over-Month</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Consistency',  val: loading ? '--' : '9.2', bar: 92, color: '#7c3aed' },
            { label: 'Adaptability', val: loading ? '--' : '8.4', bar: 84, color: '#4cd7f6' },
            { label: 'Growth Rate',  val: loading ? '--' : '+14%', bar: 70, color: '#0566d9' },
          ].map(m => (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="label-caps" style={{ color: '#958da1' }}>{m.label}</span>
                <span className="font-display font-bold text-sm" style={{ color: m.color }}>{m.val}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{
                  width: `${m.bar}%`,
                  background: `linear-gradient(90deg, ${m.color}cc, ${m.color})`,
                  boxShadow: `0 0 8px ${m.color}60`,
                }} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-4" style={{ color: '#4a4455' }}>
          Your current velocity suggests a <span style={{ color: '#4cd7f6' }}>14% faster path</span> to Senior roles than average peer groups.
        </p>
      </div>

      {/* ── CTA Banner if no resume ── */}
      {!loading && !hasResume && (
        <div className="relative rounded-2xl p-6 overflow-hidden shimmer-border" style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(5,102,217,0.1) 100%)',
          border: '1px solid rgba(124,58,237,0.25)',
        }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'rgba(124,58,237,0.08)', filter: 'blur(40px)' }} />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-lg mb-1 flex items-center gap-2" style={{ color: '#dae2fd' }}>
                <Sparkles size={18} style={{ color: '#7c3aed' }} /> Start your AI journey
              </h3>
              <p className="text-sm max-w-md" style={{ color: '#958da1' }}>
                Upload your resume to unlock AI-powered skill gap analysis, job matching, and personalized roadmaps.
              </p>
            </div>
            <Link to="/profile" className="btn-glow shrink-0 px-6 py-3 text-sm">
              Upload Resume <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
