import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Zap, ArrowRight, Mail, Lock } from 'lucide-react'

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
    <div className="min-h-screen flex bg-[#050505]">
      {/* Left panel — brand / hero */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative p-12 overflow-hidden bg-gradient-to-br from-[#0d0d0d] to-[#050505]">
        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#FF4D21]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#7F56D9]/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF4D21] flex items-center justify-center shadow-lg shadow-[#FF4D21]/30">
            <Zap className="text-white" size={20} />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">SkillSync AI</span>
        </div>

        {/* Center copy */}
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Your career,<br /><span className="text-[#FF4D21]">powered by AI.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
            Get AI-powered skill gap analysis, personalized roadmaps, and India-specific job recommendations all in one place.
          </p>

          {/* Social proof stats */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { val: '50k+', label: 'Skills Analyzed' },
              { val: '10k+', label: 'Jobs Matched' },
              { val: '95%', label: 'Match Accuracy' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-white">{s.val}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
          <p className="text-gray-300 text-sm leading-relaxed">
            "SkillSync helped me identify exactly what I was missing for a Senior React role and generated a roadmap I actually followed."
          </p>
          <p className="text-gray-500 text-xs mt-3">— Priya S., Software Engineer at Swiggy</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-[#FF4D21] flex items-center justify-center">
            <Zap className="text-white" size={18} />
          </div>
          <span className="text-white font-bold text-xl">SkillSync AI</span>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D21] focus:ring-1 focus:ring-[#FF4D21] transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type={showPwd ? 'text' : 'password'}
                required
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D21] focus:ring-1 focus:ring-[#FF4D21] transition-all"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF4D21] hover:bg-orange-500 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-[#FF4D21]/30"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-600 text-xs">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google */}
          <button
            onClick={signInWithGoogle}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-3 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-gray-600 text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#FF4D21] font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
