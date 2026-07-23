import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import LoginPage         from './pages/LoginPage'
import RegisterPage      from './pages/RegisterPage'
import LandingPage       from './pages/LandingPage'
import DashboardPage     from './pages/DashboardPage'
import SkillGapPage      from './pages/SkillGapPage'
import CareerAdvisorPage from './pages/CareerAdvisorPage'
import { ProfilePage, RoadmapPage, JobsPage, RecruiterPage, NotFoundPage, ChatPage } from './pages/OtherPages'

// Layout
import AppLayout from './components/common/AppLayout'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#0b1326' }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(124,58,237,0.2)', borderTopColor: '#7c3aed' }} />
    </div>
  )
  if (!user)   return <Navigate to="/login" replace />
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) return <Navigate to="/dashboard" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#0b1326' }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(124,58,237,0.2)', borderTopColor: '#7c3aed' }} />
    </div>
  )
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Protected — Candidate + Common */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard"      element={<DashboardPage />} />
            <Route path="/profile"        element={<ProfilePage />} />
            <Route path="/skill-gap"      element={<SkillGapPage />} />
            <Route path="/roadmap"        element={<RoadmapPage />} />
            <Route path="/jobs"           element={<JobsPage />} />
            <Route path="/career-advisor" element={<CareerAdvisorPage />} />
            <Route path="/chat"           element={<ChatPage />} />
          </Route>

          {/* Protected — Recruiter */}
          <Route path="/recruiter" element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<RecruiterPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}