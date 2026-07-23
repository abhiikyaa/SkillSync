import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, ArrowRight, Mail, Lock, User, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react'

const ROLES = [
  { value: 'candidate', label: '🎯 Candidate', desc: 'Looking for jobs & upskilling' },
  { value: 'recruiter', label: '🔍 Recruiter',  desc: 'Hiring skilled professionals' },
]

const perks = [
  { icon: '⚡', title: 'AI Resume Analysis',         desc: 'Extract skills automatically from your resume' },
  { icon: '🎯', title: 'Personalized Roadmaps',       desc: 'Step-by-step plans to land your target role' },
  { icon: '🇮🇳', title: 'India Job Market Insights', desc: 'Roles, salaries & companies curated for India' },
]

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate    = useNavigate()
  const [form, setForm]     = useState({ name: '', email: '', password: '', role: 'candidate' })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      await signUp(form.email, form.password, form.name, form.role)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex font-sans" style={{ background: '#0b1326', color: '#dae2fd' }}>

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative p-12 overflow-hidden"
        style={{ borderRight: '1px solid rgba(74,68,85,0.25)' }}>

        {/* Orbs */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'rgba(124,58,237,0.12)', filter: 'blur(100px)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'rgba(76,215,246,0.07)', filter: 'blur(80px)' }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #0566d9 100%)',
            boxShadow: '0 0 16px rgba(124,58,237,0.5)',
          }}>
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight" style={{ color: '#dae2fd' }}>
              SkillSync<span style={{ color: '#7c3aed' }}>.</span>AI
            </span>
            <div className="label-caps" style={{ color: '#7c3aed', fontSize: '9px' }}>CAREER INTELLIGENCE</div>
          </div>
        </div>

        {/* Copy */}
        <div className="relative z-10">
          <h1 className="font-display font-bold leading-tight mb-6" style={{
            fontSize: '48px', letterSpacing: '-0.02em',
          }}>
            Start your<br />
            <span className="gradient-text">skill journey</span><br />today.
          </h1>
          <p className="text-lg leading-relaxed mb-10" style={{ color: '#958da1', maxWidth: '380px' }}>
            Join thousands of professionals using AI to bridge the gap between where they are and where they want to be.
          </p>

          <div className="space-y-3">
            {perks.map(p => (
              <div key={p.title} className="flex items-start gap-4 p-4 rounded-xl" style={{
                background: 'rgba(34,42,61,0.5)',
                border: '1px solid rgba(74,68,85,0.35)',
                backdropFilter: 'blur(8px)',
              }}>
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#dae2fd' }}>{p.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#958da1' }}>{p.desc}</p>
                </div>
                <CheckCircle2 size={15} className="ml-auto shrink-0 mt-0.5" style={{ color: '#4cd7f6' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom link */}
        <div className="relative z-10 text-xs" style={{ color: '#4a4455' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-medium transition-colors" style={{ color: '#d2bbff' }}
            onMouseEnter={e => e.currentTarget.style.color = '#4cd7f6'}
            onMouseLeave={e => e.currentTarget.style.color = '#d2bbff'}>
            Sign in
          </Link>
        </div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto relative">
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'rgba(124,58,237,0.05)', filter: 'blur(80px)' }} />

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #0566d9 100%)',
          }}>
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl" style={{ color: '#dae2fd' }}>SkillSync AI</span>
        </div>

        <div className="w-full max-w-md relative z-10">
          <h2 className="font-display font-bold text-3xl mb-1" style={{ color: '#dae2fd' }}>
            Create your account
          </h2>
          <p className="mb-8 text-sm" style={{ color: '#958da1' }}>
            Free forever. No credit card required.
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl text-sm" style={{
              background: 'rgba(255,180,171,0.08)',
              border: '1px solid rgba(255,180,171,0.2)',
              color: '#ffb4ab',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="label-caps block mb-2" style={{ color: '#958da1' }}>Full Name</label>
              <div className="relative">
                <User size={15} className="aether-input-icon" />
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Alex Rivera"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="aether-input pl-11"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label-caps block mb-2" style={{ color: '#958da1' }}>Email</label>
              <div className="relative">
                <Mail size={15} className="aether-input-icon" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="aether-input pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label-caps block mb-2" style={{ color: '#958da1' }}>Password</label>
              <div className="relative">
                <Lock size={15} className="aether-input-icon" />
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  required
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="aether-input pl-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#958da1' }}
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label className="label-caps block mb-2" style={{ color: '#958da1' }}>
                <Briefcase size={11} className="inline mr-1.5" />I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    id={`role-${r.value}`}
                    onClick={() => setForm({ ...form, role: r.value })}
                    className="p-4 rounded-xl text-left transition-all duration-200"
                    style={form.role === r.value ? {
                      background: 'rgba(124,58,237,0.15)',
                      border: '1px solid rgba(124,58,237,0.45)',
                      boxShadow: '0 0 12px rgba(124,58,237,0.15)',
                    } : {
                      background: 'rgba(34,42,61,0.5)',
                      border: '1px solid rgba(74,68,85,0.4)',
                    }}
                  >
                    <p className="font-semibold text-sm" style={{
                      color: form.role === r.value ? '#d2bbff' : '#dae2fd',
                    }}>{r.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#958da1' }}>{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="register-submit"
              disabled={loading}
              className="btn-glow w-full py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-8" style={{ color: '#958da1' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold transition-colors" style={{ color: '#d2bbff' }}
              onMouseEnter={e => e.currentTarget.style.color = '#4cd7f6'}
              onMouseLeave={e => e.currentTarget.style.color = '#d2bbff'}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
