import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, User, Target, Map, Briefcase,
  LogOut, Zap, Menu, X, BrainCircuit, Bell
} from 'lucide-react'

const candidateNav = [
  { to: '/dashboard',        icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profile',          icon: User,            label: 'Profile' },
  { to: '/skill-gap',        icon: Target,          label: 'Skill Gap' },
  { to: '/roadmap',          icon: Map,             label: 'Roadmap' },
  { to: '/jobs',             icon: Briefcase,       label: 'Jobs' },
  { to: '/career-advisor',   icon: BrainCircuit,    label: 'AI Career Advisor' },
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
  '/recruiter':      'Recruiter Dashboard',
}

export default function AppLayout() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navItems = profile?.role === 'recruiter' ? recruiterNav : candidateNav
  const pageTitle = PAGE_TITLES[location.pathname] || 'SkillSync AI'

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  const initials = profile?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#0d0d0d] border-r border-white/5
        flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF4D21] flex items-center justify-center shadow-lg shadow-[#FF4D21]/30">
              <Zap className="text-white" size={16} />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">SkillSync</span>
          </div>
          <button className="lg:hidden text-gray-500 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                 ${isActive
                   ? 'bg-[#FF4D21] text-white shadow-lg shadow-[#FF4D21]/20'
                   : 'text-gray-500 hover:text-white hover:bg-white/5'}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + Sign out */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#FF4D21]/20 border border-[#FF4D21]/30 flex items-center justify-center text-[#FF4D21] text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{profile?.name || 'User'}</p>
              <p className="text-gray-600 text-xs capitalize">{profile?.role || 'candidate'}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="shrink-0 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-gray-500 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-white font-semibold text-lg">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
              <Bell size={16} />
            </button>
            <div className="w-9 h-9 rounded-xl bg-[#FF4D21]/20 border border-[#FF4D21]/30 flex items-center justify-center text-[#FF4D21] text-xs font-bold">
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
