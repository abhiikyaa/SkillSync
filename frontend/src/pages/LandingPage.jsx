import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Target, Map, Briefcase, CheckCircle2, UploadCloud, BarChart3, Sparkles, ChevronRight } from 'lucide-react'

const features = [
  {
    icon: UploadCloud,
    title: 'Resume Analysis',
    desc: 'Deconstruct your career history into structured data nodes. Our NLP engine identifies key achievements and quantifies your impact like a top-tier recruiter.',
    accent: '#7c3aed',
    chip: 'NLP Engine',
  },
  {
    icon: Target,
    title: 'Skill Gap Detection',
    desc: 'Real-time comparison against market-leading role requirements to identify exactly what\'s missing — no guesswork, pure precision.',
    accent: '#4cd7f6',
    chip: 'Real-time',
  },
  {
    icon: Map,
    title: 'AI Roadmaps',
    desc: 'Hyper-personalized learning paths and certifications to bridge the gap in weeks, not months. Curated for the Indian market.',
    accent: '#0566d9',
    chip: 'Personalized',
  },
  {
    icon: Briefcase,
    title: 'Job Matching',
    desc: 'Connect with companies where your unique skill mix is highly valued. We find the culture fit and the technical fit simultaneously.',
    accent: '#7c3aed',
    chip: 'AI-Powered',
  },
]

const stats = [
  { val: '95%',  label: 'Match Accuracy' },
  { val: '50k+', label: 'Skills Analyzed' },
  { val: '10k+', label: 'Open Roles' },
  { val: '24/7', label: 'AI Career Coach' },
]

const steps = [
  { num: '01', icon: UploadCloud,  title: 'Upload Resume',  desc: 'Our AI instantly parses your experience and identifies your current skill set with surgical precision.' },
  { num: '02', icon: BarChart3,    title: 'Analyze Gaps',   desc: 'Compare your profile against thousands of open roles to find exactly what\'s missing.' },
  { num: '03', icon: Sparkles,     title: 'Level Up',       desc: 'Follow personalized learning paths and apply directly to matching jobs in the Indian market.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: '#0b1326', color: '#dae2fd' }}>

      {/* ── Floating Navbar ── */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-50">
        <div style={{
          background: 'rgba(23, 31, 51, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(74, 68, 85, 0.35)',
          borderRadius: '9999px',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #0566d9 100%)',
              boxShadow: '0 0 12px rgba(124,58,237,0.5)',
            }}>
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-base tracking-tight" style={{ color: '#dae2fd' }}>
              SkillSync<span style={{ color: '#7c3aed' }}>.</span>AI
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6">
            {['Platform', 'Solutions', 'Career Path', 'Pricing'].map(l => (
              <a key={l} href="#" className="text-sm font-medium transition-colors"
                style={{ color: '#958da1' }}
                onMouseEnter={e => e.currentTarget.style.color = '#d2bbff'}
                onMouseLeave={e => e.currentTarget.style.color = '#958da1'}>
                {l}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link to="/login"
              className="text-sm font-medium transition-colors hidden sm:block"
              style={{ color: '#958da1' }}
              onMouseEnter={e => e.currentTarget.style.color = '#d2bbff'}
              onMouseLeave={e => e.currentTarget.style.color = '#958da1'}>
              Log in
            </Link>
            <Link to="/register"
              className="btn-glow text-sm px-5 py-2">
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-44 pb-28 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'rgba(124,58,237,0.12)', filter: 'blur(100px)' }} />
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: 'rgba(76,215,246,0.08)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'rgba(5,102,217,0.07)', filter: 'blur(80px)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 max-w-4xl"
        >
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.3)',
          }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{
              background: '#4cd7f6',
              boxShadow: '0 0 6px #4cd7f6',
            }} />
            <span className="label-caps" style={{ color: '#d2bbff', fontSize: '11px' }}>
              AI-Powered Career Engineering
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-bold tracking-tight mb-6" style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            lineHeight: '1.08',
            letterSpacing: '-0.03em',
          }}>
            Bridge Your Skills to{' '}
            <span className="gradient-text">Your Dream Job</span>
          </h1>

          <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#ccc3d8' }}>
            SkillSync uses advanced neural networks to analyze your professional DNA, identify hidden gaps,
            and map the most direct path to high-impact career opportunities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-glow px-8 py-3.5 text-base">
              Start Your Journey <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-ghost px-8 py-3.5 text-base">
              Sign In
            </Link>
          </div>

          {/* Floating stat pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
            {stats.map(s => (
              <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-full" style={{
                background: 'rgba(34,42,61,0.8)',
                border: '1px solid rgba(74,68,85,0.5)',
              }}>
                <span className="font-display font-bold" style={{ color: '#d2bbff' }}>{s.val}</span>
                <span className="text-xs" style={{ color: '#958da1' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="label-caps mb-4" style={{ color: '#7c3aed' }}>Precision Career Engineering</div>
            <h2 className="font-display font-bold mb-4" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#dae2fd' }}>
              Our multi-layered AI architecture
            </h2>
            <p style={{ color: '#958da1', maxWidth: '560px', margin: '0 auto' }}>
              Processes your professional experience through four distinct lenses of optimization.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass-card p-8 group cursor-default shimmer-border"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{
                  background: `${f.accent}20`,
                  border: `1px solid ${f.accent}40`,
                  boxShadow: `0 0 16px ${f.accent}20`,
                  transition: 'box-shadow 0.2s ease',
                }}>
                  <f.icon size={22} style={{ color: f.accent }} />
                </div>

                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display font-semibold text-xl" style={{ color: '#dae2fd' }}>{f.title}</h3>
                  <span className="ai-chip ml-3 shrink-0">{f.chip}</span>
                </div>

                <p className="text-sm leading-relaxed" style={{ color: '#958da1' }}>{f.desc}</p>

                <div className="mt-5 flex items-center gap-1.5 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: f.accent }}>
                  Learn more <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-6 relative z-10"
        style={{ borderTop: '1px solid rgba(74,68,85,0.2)', borderBottom: '1px solid rgba(74,68,85,0.2)' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(124,58,237,0.03) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="label-caps mb-4" style={{ color: '#4cd7f6' }}>The Process</div>
            <h2 className="font-display font-bold mb-4" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#dae2fd' }}>
              From resume to dream job
            </h2>
            <p style={{ color: '#958da1' }}>Three steps to precision career growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[18%] right-[18%] h-px"
              style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.4) 0%, rgba(76,215,246,0.4) 100%)' }} />

            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center"
              >
                {/* Step circle */}
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 relative z-10" style={{
                  background: '#0b1326',
                  border: '2px solid rgba(124,58,237,0.4)',
                  boxShadow: '0 0 20px rgba(124,58,237,0.2)',
                }}>
                  <s.icon size={28} style={{ color: '#d2bbff' }} />
                </div>
                <div className="label-caps mb-2" style={{ color: '#4cd7f6' }}>{s.num}</div>
                <h3 className="font-display font-semibold text-lg mb-2" style={{ color: '#dae2fd' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#958da1' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact Section ── */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="label-caps mb-4" style={{ color: '#0566d9' }}>Data-Driven Career Growth</div>
            <h2 className="font-display font-bold leading-tight mb-6" style={{
              fontSize: 'clamp(28px, 4vw, 42px)', color: '#dae2fd',
            }}>
              Stop guessing.<br />
              Start <span className="gradient-text">engineering</span> your career.
            </h2>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: '#958da1' }}>
              SkillSync removes the mystery from career advancement by giving you hard data on
              exactly what recruiters are looking for — today.
            </p>
            <ul className="space-y-3">
              {[
                'Real-time Indian market skill demands',
                'Curated, high-quality learning resources',
                'Direct pipeline to hiring managers',
                'AI-powered resume optimization',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium" style={{ color: '#ccc3d8' }}>
                  <CheckCircle2 size={18} style={{ color: '#4cd7f6', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link to="/register" className="btn-glow px-7 py-3">
                Get Started Free <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>

          {/* Stat cards */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {[
              { val: '95%',  label: 'Match Accuracy',   accent: '#7c3aed', glow: 'rgba(124,58,237,0.3)' },
              { val: '50k+', label: 'Skills Analyzed',  accent: '#4cd7f6', glow: 'rgba(76,215,246,0.2)', offset: true },
              { val: '10k+', label: 'Open Roles',       accent: '#0566d9', glow: 'rgba(5,102,217,0.2)',  offset: true },
              { val: '24/7', label: 'AI Career Coach',  accent: '#7c3aed', glow: 'rgba(124,58,237,0.2)' },
            ].map(s => (
              <div key={s.label}
                className={`glass-card p-7 text-center flex flex-col justify-center aspect-square ${s.offset ? 'translate-y-6' : ''}`}
                style={{ boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${s.glow}` }}>
                <p className="font-display font-bold mb-1.5" style={{
                  fontSize: '2.5rem', color: s.accent,
                }}>{s.val}</p>
                <p className="text-xs font-medium" style={{ color: '#958da1' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="py-20 px-6 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="glass-card p-10 shimmer-border">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Zap key={i} size={18} style={{ color: '#7c3aed', margin: '0 2px' }} fill="#7c3aed" />
              ))}
            </div>
            <p className="text-xl leading-relaxed mb-6 font-medium" style={{ color: '#dae2fd' }}>
              "SkillSync didn't just find me a job; it discovered a career path I didn't know I was qualified for.
              The AI roadmap was razor-precise."
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{
                background: 'linear-gradient(135deg, #7c3aed, #0566d9)',
                color: 'white',
              }}>PS</div>
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: '#dae2fd' }}>Priya S.</p>
                <p className="text-xs" style={{ color: '#958da1' }}>Software Engineer at Swiggy</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="py-28 px-6 text-center relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.06) 100%)' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'rgba(124,58,237,0.07)', filter: 'blur(80px)' }} />

        <motion.div
          className="relative z-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="label-caps mb-5" style={{ color: '#7c3aed' }}>Ready to Engineer Your Next Move?</div>
          <h2 className="font-display font-bold mb-6" style={{
            fontSize: 'clamp(32px, 5vw, 56px)', color: '#dae2fd', lineHeight: '1.1',
          }}>
            The future of career<br />growth is <span className="gradient-text">algorithmic</span>.
          </h2>
          <p className="mb-10 text-lg" style={{ color: '#958da1' }}>
            Stop searching and start matching with SkillSync's AI precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-glow px-8 py-3.5 text-base">
              Create Free Account <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-ghost px-8 py-3.5 text-base">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center"
        style={{ borderTop: '1px solid rgba(74,68,85,0.2)' }}>
        <p className="text-xs" style={{ color: '#4a4455' }}>
          © 2024 SkillSync AI Platform. Instrument-Grade Career Intelligence.
        </p>
        <div className="flex items-center justify-center gap-6 mt-3">
          {['Terms of Service', 'Privacy Policy', 'System Status'].map(l => (
            <a key={l} href="#" className="text-xs transition-colors"
              style={{ color: '#4a4455' }}
              onMouseEnter={e => e.currentTarget.style.color = '#958da1'}
              onMouseLeave={e => e.currentTarget.style.color = '#4a4455'}>
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}
