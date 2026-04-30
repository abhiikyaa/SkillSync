import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Zap, ArrowRight, Mail, Lock, User, Briefcase } from 'lucide-react'

const ROLES = [
  { value: 'candidate', label: '🎯 Candidate', desc: 'Looking for jobs & upskilling' },
  { value: 'recruiter', label: '🔍 Recruiter', desc: 'Hiring skilled professionals' },
]

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate' })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    try {
      await signUp(form.email, form.password, form.name, form.role)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#050505]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] to-[#050505]" />
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#7F56D9]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF4D21]/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF4D21] flex items-center justify-center shadow-lg shadow-[#FF4D21]/30">
            <Zap className="text-white" size={20} />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">SkillSync AI</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Start your<br /><span className="text-[#7F56D9]">skill journey</span><br />today.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
            Join thousands of professionals using AI to bridge the gap between where they are and where they want to be.
          </p>

          <div className="space-y-4">
            {[
              { icon: '⚡', title: 'AI Resume Analysis', desc: 'Extract skills automatically from your resume' },
              { icon: '🎯', title: 'Personalized Roadmaps', desc: 'Step-by-step plans to land your target role' },
              { icon: '🇮🇳', title: 'India Job Market Insights', desc: 'Roles, salaries & companies curated for India' },
            ].map(f => (
              <div key={f.title} className="flex items-start gap-4 bg-white/5 border border-white/8 rounded-2xl p-4 backdrop-blur-sm">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-gray-600 text-xs">
          Already have an account?{' '}
          <Link to="/login" className="text-[#FF4D21] hover:underline">Sign in</Link>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-[#FF4D21] flex items-center justify-center">
            <Zap className="text-white" size={18} />
          </div>
          <span className="text-white font-bold text-xl">SkillSync AI</span>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-1">Create your account</h2>
          <p className="text-gray-500 mb-8">Free forever. No credit card required.</p>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text" required placeholder="Full Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D21] focus:ring-1 focus:ring-[#FF4D21] transition-all"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="email" required placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D21] focus:ring-1 focus:ring-[#FF4D21] transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type={showPwd ? 'text' : 'password'} required placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D21] focus:ring-1 focus:ring-[#FF4D21] transition-all"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Role selector */}
            <div>
              <p className="text-gray-400 text-xs font-medium mb-2 flex items-center gap-1.5">
                <Briefcase size={12} /> I am a...
              </p>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r.value} type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      form.role === r.value
                        ? 'border-[#FF4D21] bg-[#FF4D21]/10'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                  >
                    <p className="font-semibold text-white text-sm">{r.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF4D21] hover:bg-orange-500 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-[#FF4D21]/30 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#FF4D21] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
