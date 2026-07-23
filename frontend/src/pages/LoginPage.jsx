import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, ArrowRight, Mail, Lock, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Sign in failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex font-sans" style={{ background: '#0b1326', color: '#dae2fd' }}>

      {/* ── Left Panel — Brand / Hero ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative p-12 overflow-hidden"
        style={{ borderRight: '1px solid rgba(74,68,85,0.25)' }}>

        {/* Background orbs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'rgba(124,58,237,0.15)', filter: 'blur(100px)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'rgba(76,215,246,0.08)', filter: 'blur(80px)' }} />

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

        {/* Center copy */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8" style={{
            background: 'rgba(76,215,246,0.08)',
            border: '1px solid rgba(76,215,246,0.2)',
          }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{
              background: '#4cd7f6', boxShadow: '0 0 6px #4cd7f6',
            }} />
            <span className="label-caps" style={{ color: '#4cd7f6', fontSize: '10px' }}>
              India's #1 AI Career Platform
            </span>
          </div>

          <h1 className="font-display font-bold leading-tight mb-6" style={{
            fontSize: '48px', letterSpacing: '-0.02em',
          }}>
            Your career,<br />
            <span className="gradient-text">powered by AI.</span>
          </h1>
          <p className="text-lg leading-relaxed mb-10" style={{ color: '#958da1', maxWidth: '380px' }}>
            Get AI-powered skill gap analysis, personalized roadmaps, and India-specific job recommendations all in one place.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { val: '50k+', label: 'Skills Analyzed' },
              { val: '10k+', label: 'Jobs Matched' },
              { val: '95%',  label: 'Match Accuracy' },
            ].map(s => (
              <div key={s.label} className="glass-card-sm p-4">
                <p className="font-display font-bold text-2xl" style={{ color: '#d2bbff' }}>{s.val}</p>
                <p className="text-xs mt-1" style={{ color: '#958da1' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 p-5 rounded-xl shimmer-border" style={{
          background: 'rgba(34,42,61,0.6)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(74,68,85,0.4)',
        }}>
          <p className="text-sm leading-relaxed mb-3" style={{ color: '#ccc3d8' }}>
            "SkillSync helped me identify exactly what I was missing for a Senior React role and generated a roadmap I actually followed."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{
              background: 'linear-gradient(135deg, #7c3aed, #0566d9)', color: 'white',
            }}>PS</div>
            <p className="text-xs" style={{ color: '#958da1' }}>— Priya S., Software Engineer at Swiggy</p>
          </div>
        </div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Subtle orb */}
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'rgba(124,58,237,0.06)', filter: 'blur(80px)' }} />

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
            Welcome back
          </h2>
          <p className="mb-8 text-sm" style={{ color: '#958da1' }}>
            Sign in to your account to continue
          </p>

          {/* Error */}
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
                  placeholder="••••••••"
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

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="btn-glow w-full py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(74,68,85,0.4)' }} />
            <span className="text-xs" style={{ color: '#4a4455' }}>OR</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(74,68,85,0.4)' }} />
          </div>

          {/* Google */}
          <button
            id="google-signin"
            onClick={signInWithGoogle}
            className="btn-ghost w-full py-3.5"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm mt-8" style={{ color: '#958da1' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold transition-colors" style={{ color: '#d2bbff' }}
              onMouseEnter={e => e.currentTarget.style.color = '#4cd7f6'}
              onMouseLeave={e => e.currentTarget.style.color = '#d2bbff'}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
