// ── ProfilePage, RoadmapPage, JobsPage, RecruiterPage, NotFoundPage, ChatPage ──
import { useEffect, useState, useRef, useCallback } from 'react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import {
  CheckCircle, Circle, Lock, Map, Upload, Briefcase, BookOpen, ExternalLink,
  Search, X, Loader2, Sparkles, ArrowRight, Send, Bot, User, Trash2, MessageSquare
} from 'lucide-react'

/* ─────────────────────────── ProfilePage ─────────────────────────── */
export function ProfilePage() {
  const { profile } = useAuth()
  const [fullProfile, setFullProfile] = useState(null)
  const [uploading, setUploading]     = useState(false)
  const [msg, setMsg]                 = useState({ text: '', type: '' })
  const [editing, setEditing]         = useState(false)
  const [editForm, setEditForm]       = useState({ name: '', bio: '', location: '', careerGoal: '' })
  const [saving, setSaving]           = useState(false)

  const initials = profile?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  useEffect(() => {
    api.get('/users/profile').then(r => {
      setFullProfile(r.data)
      setEditForm({ name: r.data.name || '', bio: r.data.bio || '', location: r.data.location || '', careerGoal: r.data.career_goal || '' })
    }).catch(() => {})
  }, [])

  async function handleResumeUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return setMsg({ text: 'File must be under 5MB', type: 'error' })
    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      return setMsg({ text: 'Only PDF and Word documents are supported', type: 'error' })
    }
    setUploading(true); setMsg({ text: '', type: '' })
    const fd = new FormData(); fd.append('resume', file)
    try {
      await api.post('/users/resume', fd)
      const updated = await api.get('/users/profile')
      const skillCount = updated.data?.user_skills?.length || 0
      setMsg({ text: `✅ Resume uploaded! ${skillCount} skills extracted by AI.`, type: 'success' })
      setFullProfile(updated.data)
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Upload failed'
      setMsg({ text: `❌ ${errorMsg}`, type: 'error' })
    }
    finally { setUploading(false) }
  }

  async function handleSaveProfile() {
    setSaving(true)
    try {
      const { data } = await api.put('/users/profile', editForm)
      setFullProfile(prev => ({ ...prev, ...data })); setEditing(false)
      setMsg({ text: '✅ Profile updated!', type: 'success' })
    } catch { setMsg({ text: '❌ Could not save profile.', type: 'error' }) }
    finally { setSaving(false) }
  }

  const userSkills = fullProfile?.user_skills || []
  const PROF_LABEL = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced', 4: 'Expert' }
  const PROF_COLOR = {
    1: { bg: 'rgba(255,180,171,0.1)', border: 'rgba(255,180,171,0.25)', color: '#ffb4ab' },
    2: { bg: 'rgba(210,187,255,0.1)', border: 'rgba(210,187,255,0.25)', color: '#d2bbff' },
    3: { bg: 'rgba(173,198,255,0.1)', border: 'rgba(173,198,255,0.25)', color: '#adc6ff' },
    4: { bg: 'rgba(76,215,246,0.1)',  border: 'rgba(76,215,246,0.25)',  color: '#4cd7f6' },
  }

  return (
    <div className="max-w-5xl space-y-6 animate-fade-in">
      {msg.text && (
        <div className="px-4 py-3 rounded-xl text-sm flex items-center justify-between" style={msg.type === 'error'
          ? { background: 'rgba(255,180,171,0.08)', border: '1px solid rgba(255,180,171,0.2)', color: '#ffb4ab' }
          : { background: 'rgba(76,215,246,0.08)', border: '1px solid rgba(76,215,246,0.2)', color: '#4cd7f6' }}>
          {msg.text}
          <button onClick={() => setMsg({ text: '', type: '' })}><X size={14} /></button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <div className="glass-card p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-3xl mb-4" style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(5,102,217,0.15) 100%)',
            border: '2px solid rgba(124,58,237,0.35)', color: '#d2bbff',
          }}>{initials}</div>

          {editing ? (
            <div className="space-y-3 w-full text-left">
              {[
                { key: 'name', placeholder: 'Full Name' },
                { key: 'location', placeholder: 'Location (e.g. Bangalore)' },
                { key: 'careerGoal', placeholder: 'Career goal' },
              ].map(({ key, placeholder }) => (
                <input key={key} value={editForm[key]} placeholder={placeholder}
                  onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                  className="aether-input text-xs" />
              ))}
              <textarea value={editForm.bio} placeholder="Short bio..." rows={2}
                onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                className="aether-input text-xs resize-none w-full" />
              <div className="flex gap-2">
                <button onClick={handleSaveProfile} disabled={saving} className="btn-glow flex-1 py-2 text-xs">{saving ? 'Saving...' : 'Save'}</button>
                <button onClick={() => setEditing(false)} className="btn-ghost flex-1 py-2 text-xs">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p className="font-display font-bold text-lg" style={{ color: '#dae2fd' }}>{fullProfile?.name || profile?.name}</p>
              <p className="text-sm capitalize mt-0.5" style={{ color: '#958da1' }}>{profile?.role}</p>
              {fullProfile?.location && <p className="text-xs mt-1" style={{ color: '#4a4455' }}>📍 {fullProfile.location}</p>}
              {fullProfile?.career_goal && (
                <div className="ai-chip mt-2">🎯 {fullProfile.career_goal}</div>
              )}
              {fullProfile?.bio && <p className="text-xs mt-3 leading-relaxed" style={{ color: '#958da1' }}>{fullProfile.bio}</p>}
              <button onClick={() => setEditing(true)} className="btn-ghost mt-4 w-full py-2 text-xs">Edit Profile</button>
            </>
          )}
        </div>

        {/* Resume upload */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="font-display font-semibold text-base mb-1" style={{ color: '#dae2fd' }}>Resume Upload</h2>
          <p className="text-sm mb-5" style={{ color: '#958da1' }}>Upload your PDF resume and our AI will automatically extract your technical skills.</p>
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all"
            style={{ borderColor: uploading ? 'rgba(124,58,237,0.5)' : 'rgba(74,68,85,0.5)', background: uploading ? 'rgba(124,58,237,0.05)' : 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'; e.currentTarget.style.background = 'rgba(124,58,237,0.05)' }}
            onMouseLeave={e => { if (!uploading) { e.currentTarget.style.borderColor = 'rgba(74,68,85,0.5)'; e.currentTarget.style.background = 'transparent' } }}>
            {uploading ? (
              <><Loader2 size={28} className="animate-spin mb-2" style={{ color: '#7c3aed' }} /><span className="text-sm font-medium" style={{ color: '#d2bbff' }}>Uploading & extracting with AI...</span></>
            ) : (
              <><Upload size={28} className="mb-2" style={{ color: '#4a4455' }} /><span className="text-sm font-medium" style={{ color: '#ccc3d8' }}>Click to upload PDF or DOC</span><span className="text-xs mt-1" style={{ color: '#4a4455' }}>Max 5MB · AI-powered skill extraction</span></>
            )}
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
          </label>
        </div>
      </div>

      {/* Skills grid */}
      {userSkills.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-base" style={{ color: '#dae2fd' }}>Your Skills ({userSkills.length})</h2>
            <span className="text-xs" style={{ color: '#4a4455' }}>Extracted via AI</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {userSkills.map(us => {
              const c = PROF_COLOR[us.proficiency] || PROF_COLOR[1]
              return (
                <span key={us.skill_id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium"
                  style={{ background: c.bg, borderColor: c.border, color: c.color }}>
                  {us.skills?.skill_name || 'Unknown'}
                  <span className="opacity-60">· {PROF_LABEL[us.proficiency] || 'Beginner'}</span>
                </span>
              )
            })}
          </div>
        </div>
      )}

      {userSkills.length === 0 && !uploading && (
        <div className="glass-card p-8 text-center" style={{ border: '1px dashed rgba(74,68,85,0.5)' }}>
          <Upload size={36} className="mx-auto mb-3" style={{ color: '#4a4455' }} />
          <p className="text-sm" style={{ color: '#958da1' }}>No skills yet. Upload your resume to let AI extract them automatically.</p>
        </div>
      )}
    </div>
  )
}

export default ProfilePage

/* ─────────────────────────── RoadmapPage ─────────────────────────── */
export function RoadmapPage() {
  const [roadmap, setRoadmap] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users/roadmap').then(r => setRoadmap(r.data.steps || [])).catch(() => setRoadmap([])).finally(() => setLoading(false))
  }, [])

  async function toggleStep(id, done) {
    await api.patch(`/users/roadmap/${id}`, { completed: !done })
    setRoadmap(prev => prev.map(s => s.id === id ? { ...s, completed: !done } : s))
  }

  const completed = roadmap.filter(s => s.completed).length
  const progress  = roadmap.length > 0 ? Math.round((completed / roadmap.length) * 100) : 0

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin" style={{ color: '#7c3aed' }} />
        </div>
      ) : roadmap.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <Map size={28} style={{ color: '#7c3aed' }} />
          </div>
          <p className="font-display font-semibold text-lg mb-2" style={{ color: '#dae2fd' }}>No roadmap yet</p>
          <p className="text-sm mb-6" style={{ color: '#958da1' }}>Analyse your skill gap against a job to auto-generate a personalized learning roadmap, or use the AI Career Advisor.</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a href="/skill-gap" className="btn-glow px-5 py-2.5 text-sm">Analyse Skill Gap <ArrowRight size={14} /></a>
            <a href="/career-advisor" className="btn-ghost px-5 py-2.5 text-sm"><Sparkles size={14} /> AI Career Advisor</a>
          </div>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-semibold" style={{ color: '#dae2fd' }}>Overall Progress</p>
              <span className="font-display font-bold" style={{ color: '#d2bbff' }}>{progress}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #7c3aed, #4cd7f6)',
                boxShadow: '0 0 8px rgba(124,58,237,0.5)',
              }} />
            </div>
            <p className="text-xs mt-2" style={{ color: '#4a4455' }}>{completed} of {roadmap.length} steps completed</p>
          </div>

          {/* Steps */}
          <div className="glass-card p-6">
            <div className="relative">
              <div className="absolute left-5 top-6 bottom-6 w-px" style={{ background: 'rgba(74,68,85,0.4)' }} />
              <div className="space-y-5">
                {roadmap.map((step, i) => {
                  const isUnlocked = i === 0 || roadmap[i - 1]?.completed
                  return (
                    <div key={step.id} className="flex gap-4 relative">
                      <button
                        onClick={() => isUnlocked && toggleStep(step.id, step.completed)}
                        disabled={!isUnlocked}
                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-all z-10"
                        style={step.completed
                          ? { borderColor: '#4cd7f6', background: 'rgba(76,215,246,0.15)', color: '#4cd7f6' }
                          : isUnlocked
                          ? { borderColor: '#7c3aed', background: 'rgba(124,58,237,0.15)', color: '#d2bbff', cursor: 'pointer' }
                          : { borderColor: 'rgba(74,68,85,0.5)', background: 'rgba(34,42,61,0.4)', color: '#4a4455', cursor: 'not-allowed' }}
                      >
                        {step.completed ? <CheckCircle size={18} /> : isUnlocked ? <Circle size={18} /> : <Lock size={16} />}
                      </button>
                      <div className="flex-1 p-4 rounded-xl transition-all" style={
                        step.completed
                          ? { background: 'rgba(76,215,246,0.05)', border: '1px solid rgba(76,215,246,0.2)' }
                          : { background: 'rgba(34,42,61,0.4)', border: '1px solid rgba(74,68,85,0.3)' }
                      }>
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-sm" style={{ color: step.completed ? '#4cd7f6' : '#dae2fd', textDecoration: step.completed ? 'line-through' : 'none', opacity: step.completed ? 0.7 : 1 }}>
                            {step.title || step.learning_paths?.title}
                          </p>
                          <span className="text-xs shrink-0" style={{ color: '#4a4455' }}>{step.estimated_time || step.learning_paths?.duration}</span>
                        </div>
                        {(step.resource_url || step.learning_paths?.url) && (
                          <a href={step.resource_url || step.learning_paths?.url} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs mt-1.5 transition-colors" style={{ color: '#d2bbff' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#4cd7f6'}
                            onMouseLeave={e => e.currentTarget.style.color = '#d2bbff'}>
                            <BookOpen size={11} /> View resource <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ─────────────────────────── JobsPage ─────────────────────────── */
export function JobsPage() {
  const [jobs, setJobs]         = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading]   = useState(true)
  const [applying, setApplying] = useState(null)
  const [search, setSearch]     = useState('')

  useEffect(() => {
    api.get('/jobs/recommendations').then(r => { const d = r.data.jobs || []; setJobs(d); setFiltered(d) })
      .catch(() => { setJobs([]); setFiltered([]) }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(jobs.filter(j => j.title?.toLowerCase().includes(q) || j.company?.toLowerCase().includes(q) || j.location?.toLowerCase().includes(q) || j.skills?.some(s => s.toLowerCase().includes(q))))
  }, [search, jobs])

  async function apply(jobId) {
    setApplying(jobId)
    try { await api.post('/jobs/apply', { jobId }); setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applied: true } : j)) }
    catch {} finally { setApplying(null) }
  }

  const scoreColor = s => s >= 80 ? { color: '#4cd7f6', bg: 'rgba(76,215,246,0.1)', border: 'rgba(76,215,246,0.3)' }
    : s >= 60 ? { color: '#d2bbff', bg: 'rgba(210,187,255,0.1)', border: 'rgba(210,187,255,0.3)' }
    : { color: '#adc6ff', bg: 'rgba(173,198,255,0.1)', border: 'rgba(173,198,255,0.3)' }

  return (
    <div className="max-w-5xl space-y-5 animate-fade-in">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={15} style={{ color: '#958da1' }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, company, location or skill..."
          className="aether-input pl-11 pr-10 w-full" />
        {search && <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: '#958da1' }}><X size={15} /></button>}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin" style={{ color: '#7c3aed' }} /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Briefcase size={40} className="mx-auto mb-4" style={{ color: '#4a4455' }} />
          <p className="font-display font-semibold mb-2" style={{ color: '#dae2fd' }}>{search ? 'No jobs match your search' : 'No jobs matched yet'}</p>
          <p className="text-sm" style={{ color: '#958da1' }}>{search ? 'Try different keywords.' : 'Upload your resume to get AI-matched job recommendations.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs" style={{ color: '#4a4455' }}>{filtered.length} {filtered.length === 1 ? 'role' : 'roles'} found</p>
          {filtered.map(job => {
            const sc = scoreColor(job.matchScore)
            return (
              <div key={job.id} className="glass-card p-5 group" style={{ transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-display font-bold text-base" style={{ color: '#dae2fd' }}>{job.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full border font-medium" style={{ color: sc.color, background: sc.bg, borderColor: sc.border }}>{job.matchScore}% match</span>
                      {job.applied && <span className="ai-chip ai-chip-cyan">Applied ✓</span>}
                    </div>
                    <p className="text-sm" style={{ color: '#958da1' }}>
                      {job.company && <span className="font-medium" style={{ color: '#ccc3d8' }}>{job.company}</span>}
                      {job.location && <span> · 📍 {job.location}</span>}
                    </p>
                    {job.salaryRange && <p className="text-xs font-medium mt-1" style={{ color: '#4cd7f6' }}>💰 {job.salaryRange}</p>}
                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.skills.slice(0, 6).map(s => <span key={s} className="ai-chip ai-chip-blue text-[10px]">{s}</span>)}
                        {job.skills.length > 6 && <span className="text-xs" style={{ color: '#4a4455' }}>+{job.skills.length - 6} more</span>}
                      </div>
                    )}
                  </div>
                  <button onClick={() => apply(job.id)} disabled={job.applied || applying === job.id}
                    className={job.applied ? 'btn-outline text-xs px-4 py-2 cursor-not-allowed opacity-60' : 'btn-glow text-xs px-5 py-2.5'}
                    style={job.applied ? { color: '#4cd7f6', borderColor: 'rgba(76,215,246,0.3)' } : {}}>
                    {job.applied ? 'Applied' : applying === job.id ? '...' : 'Apply Now'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────── RecruiterPage ─────────────────────────── */
export function RecruiterPage() {
  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="glass-card p-10 text-center" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(5,102,217,0.05) 100%)', borderColor: 'rgba(124,58,237,0.2)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
          <Briefcase size={28} style={{ color: '#d2bbff' }} />
        </div>
        <h1 className="font-display font-bold text-2xl mb-2" style={{ color: '#dae2fd' }}>Recruiter Dashboard</h1>
        <p className="mb-6" style={{ color: '#958da1' }}>Post jobs and find AI-matched candidates for your open roles.</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)' }}>
          <div className="status-dot" />
          <span className="label-caps" style={{ color: '#d2bbff', fontSize: '10px' }}>Coming in Phase 2</span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────── NotFoundPage ─────────────────────────── */
export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0b1326' }}>
      <div className="text-center">
        <p className="font-display font-black leading-none" style={{ fontSize: '160px', color: 'rgba(124,58,237,0.08)' }}>404</p>
        <p className="font-display font-bold text-2xl -mt-6" style={{ color: '#dae2fd' }}>Page not found</p>
        <p className="text-sm mt-2 mb-8" style={{ color: '#958da1' }}>The page you're looking for doesn't exist.</p>
        <a href="/dashboard" className="btn-glow px-6 py-3 text-sm inline-flex">Back to Dashboard <ArrowRight size={14} /></a>
      </div>
    </div>
  )
}

/* ─────────────────────────── ChatPage ─────────────────────────── */

const SUGGESTED_QUESTIONS = [
  'What skills should I learn to become a Senior React Developer?',
  'How do I prepare for system design interviews at Flipkart?',
  'What is the average salary for a Node.js developer in Bangalore?',
  'How do I transition from a service company to a product company?',
  'Which certifications are most valued in the Indian job market?',
]

function ChatBubble({ message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}>
      {/* Avatar */}
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={
        isUser
          ? { background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.35)' }
          : { background: 'rgba(76,215,246,0.1)', border: '1px solid rgba(76,215,246,0.25)' }
      }>
        {isUser
          ? <User size={14} style={{ color: '#d2bbff' }} />
          : <Bot size={14} style={{ color: '#4cd7f6' }} />
        }
      </div>

      {/* Bubble */}
      <div className="max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap" style={
        isUser
          ? {
              background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(5,102,217,0.2) 100%)',
              border: '1px solid rgba(124,58,237,0.3)',
              color: '#dae2fd',
              borderBottomRightRadius: '4px',
            }
          : {
              background: 'rgba(34,42,61,0.6)',
              border: '1px solid rgba(74,68,85,0.4)',
              color: '#ccc3d8',
              borderBottomLeftRadius: '4px',
            }
      }>
        {message.content}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(76,215,246,0.1)', border: '1px solid rgba(76,215,246,0.25)' }}>
        <Bot size={14} style={{ color: '#4cd7f6' }} />
      </div>
      <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(34,42,61,0.6)', border: '1px solid rgba(74,68,85,0.4)', borderBottomLeftRadius: '4px' }}>
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map(i => (
            <span key={i} className="w-1.5 h-1.5 rounded-full" style={{
              background: '#4cd7f6',
              opacity: 0.6,
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ChatPage() {
  const { profile } = useAuth()
  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [userContext, setUserContext] = useState({ skills: [], yearsOfExperience: 0, currentRole: '', targetRole: '' })
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  // Load user profile for context
  useEffect(() => {
    api.get('/users/profile').then(r => {
      const p = r.data
      setUserContext({
        skills: p.user_skills || [],
        yearsOfExperience: p.years_of_experience || 0,
        currentRole: p.current_role || '',
        targetRole: p.career_goal || '',
      })
    }).catch(() => {})
  }, [])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 140) + 'px'
  }, [input])

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed || loading) return

    const userMsg = { role: 'user', content: trimmed }
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await api.post('/chat', {
        message: trimmed,
        history: messages, // send history before this message
        context: userContext,
      })
      const reply = res.data.reply
      setMessages([...newHistory, { role: 'assistant', content: reply }])
    } catch (err) {
      setError('Could not reach the AI. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [input, messages, loading, userContext])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col animate-fade-in" style={{ height: 'calc(100vh - 80px)', maxWidth: '820px' }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(76,215,246,0.15) 0%, rgba(124,58,237,0.1) 100%)', border: '1px solid rgba(76,215,246,0.3)' }}>
            <Sparkles size={18} style={{ color: '#4cd7f6' }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-base" style={{ color: '#dae2fd' }}>AI Career Advisor</h1>
            <p className="text-xs" style={{ color: '#958da1' }}>Powered by Gemini · Indian tech market specialist</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={() => { setMessages([]); setError(null) }}
            className="btn-ghost flex items-center gap-1.5 text-xs px-3 py-1.5"
            style={{ color: '#958da1' }}>
            <Trash2 size={13} /> Clear chat
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto rounded-2xl p-4 space-y-4 min-h-0"
        style={{ background: 'rgba(11,19,38,0.5)', border: '1px solid rgba(74,68,85,0.3)' }}>

        {/* Welcome state */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{
              background: 'linear-gradient(135deg, rgba(76,215,246,0.12) 0%, rgba(124,58,237,0.1) 100%)',
              border: '1px solid rgba(76,215,246,0.2)',
            }}>
              <MessageSquare size={28} style={{ color: '#4cd7f6' }} />
            </div>
            <p className="font-display font-semibold mb-1" style={{ color: '#dae2fd' }}>
              Hi {profile?.name?.split(' ')[0] || 'there'}! 👋
            </p>
            <p className="text-sm mb-6 max-w-sm" style={{ color: '#958da1' }}>
              Ask me anything about your career — salary expectations, interview prep, skill gaps, or job market trends in India.
            </p>
            {/* Suggested questions */}
            <div className="flex flex-col gap-2 w-full max-w-md">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)}
                  className="text-left text-xs px-4 py-2.5 rounded-xl transition-all"
                  style={{ background: 'rgba(34,42,61,0.5)', border: '1px solid rgba(74,68,85,0.35)', color: '#958da1' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'; e.currentTarget.style.color = '#ccc3d8' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(74,68,85,0.35)'; e.currentTarget.style.color = '#958da1' }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => <ChatBubble key={i} message={msg} />)}

        {/* Typing indicator */}
        {loading && <TypingIndicator />}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl" style={{ background: 'rgba(255,180,171,0.08)', border: '1px solid rgba(255,180,171,0.2)', color: '#ffb4ab' }}>
            <X size={13} />
            {error}
            <button onClick={() => setError(null)} className="ml-auto underline">Dismiss</button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="mt-3 shrink-0">
        <div className="flex gap-3 items-end p-3 rounded-2xl" style={{ background: 'rgba(34,42,61,0.6)', border: '1px solid rgba(74,68,85,0.4)' }}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about salaries, interviews, skill gaps, career switch..."
            className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed"
            style={{ color: '#dae2fd', caretColor: '#7c3aed', minHeight: '24px', maxHeight: '140px' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all"
            style={{
              background: input.trim() && !loading ? 'linear-gradient(135deg, #7c3aed, #0566d9)' : 'rgba(74,68,85,0.3)',
              border: '1px solid ' + (input.trim() && !loading ? 'rgba(124,58,237,0.5)' : 'rgba(74,68,85,0.4)'),
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            }}>
            {loading
              ? <Loader2 size={15} className="animate-spin" style={{ color: '#958da1' }} />
              : <Send size={15} style={{ color: input.trim() ? '#fff' : '#4a4455' }} />
            }
          </button>
        </div>
        <p className="text-center text-xs mt-2" style={{ color: '#4a4455' }}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>

      {/* Bounce animation for typing dots */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}