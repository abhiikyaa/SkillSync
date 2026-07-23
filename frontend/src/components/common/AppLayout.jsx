import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, User, Target, Map, Briefcase,
  LogOut, Menu, X, BrainCircuit, Bell, Sparkles, ChevronRight, MessageSquare
} from 'lucide-react'

const candidateNav = [
  { to: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard'        },
  { to: '/profile',        icon: User,            label: 'Profile'           },
  { to: '/skill-gap',      icon: Target,          label: 'Skill Gap'         },
  { to: '/roadmap',        icon: Map,             label: 'Roadmap'           },
  { to: '/jobs',           icon: Briefcase,       label: 'Jobs'              },
  { to: '/career-advisor', icon: BrainCircuit,    label: 'AI Career Advisor' },
  { to: '/chat',           icon: MessageSquare,   label: 'AI Chat Advisor'   }, // ← NEW
]

const recruiterNav = [
  { to: '/recruiter', icon: LayoutDashboard, label: 'Dashboard' },
]

const PAGE_TITLES = {
  '/dashboard':      'Dashboard',
  '/profile':        'My Profile',
  '/skill-gap':      'Skill Gap Analysis',
  '/roadmap':        'Learning Roadmap',
  '/jobs':           'Matched Jobs',
  '/career-advisor': 'AI Career Advisor',
  '/chat':           'AI Chat Advisor',   // ← NEW
  '/recruiter':      'Recruiter Dashboard',
}

export default function AppLayout() {
  const { profile, signOut } = useAuth()
  const navigate             = useNavigate()
  const location             = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems  = profile?.role === 'recruiter' ? recruiterNav : candidateNav
  const pageTitle = PAGE_TITLES[location.pathname] || 'SkillSync AI'
  const initials  = profile?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0b1326' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `} style={{
        background: 'rgba(13, 20, 40, 0.95)',
        borderRight: '1px solid rgba(74, 68, 85, 0.3)',
        backdropFilter: 'blur(12px)',
      }}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 shrink-0"
          style={{ borderBottom: '1px solid rgba(74,68,85,0.25)' }}>
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #0566d9 100%)',
                boxShadow: '0 0 16px 3px rgba(124,58,237,0.4)',
              }}>
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight"
                style={{ color: '#dae2fd' }}>SkillSync</span>
              <div className="label-caps" style={{ color: '#7c3aed', fontSize: '9px' }}>AI PLATFORM</div>
            </div>
          </div>
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            style={{ color: '#958da1' }}
            onClick={() => setSidebarOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tier badge */}
        <div className="mx-4 mt-4 px-3 py-2 rounded-xl" style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(5,102,217,0.1) 100%)',
          border: '1px solid rgba(124,58,237,0.2)',
        }}>
          <div className="flex items-center gap-2">
            <div className="status-dot" />
            <span className="label-caps" style={{ color: '#d2bbff', fontSize: '10px' }}>
              {profile?.role === 'recruiter' ? 'RECRUITER' : 'CANDIDATE'}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="label-caps px-3 mb-3" style={{ color: '#4a4455', fontSize: '10px' }}>NAVIGATION</p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive ? 'active-nav-item' : 'nav-item'
                }`
              }
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(5,102,217,0.15) 100%)',
                border: '1px solid rgba(124,58,237,0.3)',
                color: '#d2bbff',
                boxShadow: '0 0 12px rgba(124,58,237,0.15)',
              } : {
                color: '#958da1',
                border: '1px solid transparent',
              }}
              onMouseEnter={e => {
                if (!e.currentTarget.classList.contains('active-nav-item')) {
                  e.currentTarget.style.color = '#dae2fd'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.classList.contains('active-nav-item')) {
                  e.currentTarget.style.color = '#958da1'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <Icon size={17} className="shrink-0" />
              <span className="flex-1">{label}</span>
              <ChevronRight size={13} className="opacity-0 group-hover:opacity-40 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* User + Sign out */}
        <div className="p-3 shrink-0" style={{ borderTop: '1px solid rgba(74,68,85,0.25)' }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(5,102,217,0.2) 100%)',
                border: '1px solid rgba(124,58,237,0.4)',
                color: '#d2bbff',
              }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: '#dae2fd' }}>
                {profile?.name || 'User'}
              </p>
              <p className="text-xs capitalize" style={{ color: '#958da1' }}>
                {profile?.role || 'candidate'}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 hover:bg-white/5"
            style={{ color: '#958da1' }}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="shrink-0 px-6 py-3.5 flex items-center justify-between"
          style={{
            background: 'rgba(11,19,38,0.8)',
            borderBottom: '1px solid rgba(74,68,85,0.25)',
            backdropFilter: 'blur(12px)',
          }}>
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
              style={{ color: '#958da1' }}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-display font-semibold text-lg" style={{ color: '#dae2fd' }}>
                {pageTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(74,68,85,0.4)',
                color: '#958da1',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#d2bbff'
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#958da1'
                e.currentTarget.style.borderColor = 'rgba(74,68,85,0.4)'
              }}
            >
              <Bell size={16} />
            </button>

            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(5,102,217,0.15) 100%)',
                border: '1px solid rgba(124,58,237,0.35)',
                color: '#d2bbff',
              }}>
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}