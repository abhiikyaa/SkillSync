// ── ProfilePage ──────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import api from '../lib/api'
import { CheckCircle, Circle, Lock, Map, Upload, Briefcase, BookOpen, ExternalLink, Search, Filter, X, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function ProfilePage() {
  const { profile } = useAuth()
  const [fullProfile, setFullProfile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', bio: '', location: '', careerGoal: '' })
  const [saving, setSaving] = useState(false)

  const initials = profile?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  useEffect(() => {
    api.get('/users/profile')
      .then(r => {
        setFullProfile(r.data)
        setEditForm({
          name: r.data.name || '',
          bio: r.data.bio || '',
          location: r.data.location || '',
          careerGoal: r.data.career_goal || '',
        })
      })
      .catch(() => {})
  }, [])

  async function handleResumeUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return setMsg({ text: 'File must be under 5MB', type: 'error' })
    setUploading(true)
    setMsg({ text: '', type: '' })
    const fd = new FormData()
    fd.append('resume', file)
    try {
      const { data } = await api.post('/users/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setMsg({ text: `✅ Resume uploaded! ${data.skillsExtracted} skills extracted by AI.`, type: 'success' })
      // Refresh profile to show new skills
      const updated = await api.get('/users/profile')
      setFullProfile(updated.data)
    } catch {
      setMsg({ text: '❌ Upload failed. Please try again.', type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  async function handleSaveProfile() {
    setSaving(true)
    try {
      const { data } = await api.put('/users/profile', editForm)
      setFullProfile(prev => ({ ...prev, ...data }))
      setEditing(false)
      setMsg({ text: '✅ Profile updated!', type: 'success' })
    } catch {
      setMsg({ text: '❌ Could not save profile.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const userSkills = fullProfile?.user_skills || []
  const PROFICIENCY_LABELS = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced', 4: 'Expert' }
  const PROFICIENCY_COLORS = {
    1: 'bg-red-500/10 text-red-400 border-red-500/20',
    2: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    3: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    4: 'bg-green-500/10 text-green-400 border-green-500/20',
  }

  return (
    <div className="max-w-5xl space-y-6">
      {msg.text && (
        <div className={`px-4 py-3 rounded-xl text-sm flex items-center justify-between ${msg.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-green-500/10 border border-green-500/20 text-green-400'}`}>
          {msg.text}
          <button onClick={() => setMsg({ text: '', type: '' })}><X size={14} /></button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Avatar + Info */}
        <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#FF4D21]/20 border-2 border-[#FF4D21]/30 flex items-center justify-center text-[#FF4D21] font-bold text-3xl mb-4">
            {initials}
          </div>
          {editing ? (
            <div className="space-y-3 w-full text-left">
              <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Full Name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF4D21] transition-all" />
              <input value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                placeholder="Location (e.g. Bangalore)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF4D21] transition-all" />
              <textarea value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Short bio..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF4D21] transition-all resize-none" />
              <input value={editForm.careerGoal} onChange={e => setEditForm({ ...editForm, careerGoal: e.target.value })}
                placeholder="Career goal (e.g. Senior React Developer)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#FF4D21] transition-all" />
              <div className="flex gap-2">
                <button onClick={handleSaveProfile} disabled={saving}
                  className="flex-1 bg-[#FF4D21] hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-semibold py-2 rounded-lg transition-all">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditing(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-semibold py-2 rounded-lg transition-all">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-white font-bold text-lg">{fullProfile?.name || profile?.name}</p>
              <p className="text-gray-500 text-sm capitalize mt-0.5">{profile?.role}</p>
              {fullProfile?.location && <p className="text-gray-600 text-xs mt-1">📍 {fullProfile.location}</p>}
              {fullProfile?.career_goal && (
                <p className="text-[#FF4D21] text-xs mt-2 bg-[#FF4D21]/10 border border-[#FF4D21]/20 px-3 py-1 rounded-full">
                  🎯 {fullProfile.career_goal}
                </p>
              )}
              {fullProfile?.bio && <p className="text-gray-500 text-xs mt-3 leading-relaxed">{fullProfile.bio}</p>}
              <button onClick={() => setEditing(true)}
                className="mt-4 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-xs font-medium py-2 rounded-lg transition-all">
                Edit Profile
              </button>
            </>
          )}
        </div>

        {/* Right — Upload Resume */}
        <div className="lg:col-span-2 bg-[#0d0d0d] border border-white/5 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-2">Resume Upload</h2>
          <p className="text-gray-500 text-sm mb-5">Upload your PDF resume and our AI will automatically extract your technical skills.</p>

          <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all ${uploading ? 'border-[#FF4D21]/40 bg-[#FF4D21]/5' : 'border-white/10 hover:border-[#FF4D21]/40 hover:bg-[#FF4D21]/5'}`}>
            {uploading ? (
              <>
                <Loader2 size={28} className="text-[#FF4D21] mb-2 animate-spin" />
                <span className="text-sm text-[#FF4D21] font-medium">Uploading & extracting with AI...</span>
              </>
            ) : (
              <>
                <Upload size={28} className="text-gray-600 mb-2" />
                <span className="text-sm text-gray-400 font-medium">Click to upload PDF or DOC</span>
                <span className="text-xs text-gray-600 mt-1">Max 5MB · AI-powered skill extraction</span>
              </>
            )}
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
          </label>
        </div>
      </div>

      {/* Skills Grid */}
      {userSkills.length > 0 && (
        <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Your Skills ({userSkills.length})</h2>
            <span className="text-gray-600 text-xs">Extracted from resume via AI</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {userSkills.map(us => (
              <span key={us.skill_id}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${PROFICIENCY_COLORS[us.proficiency] || 'bg-white/5 text-gray-400 border-white/10'}`}>
                {us.skills?.skill_name || 'Unknown'}
                <span className="opacity-60">· {PROFICIENCY_LABELS[us.proficiency] || 'Beginner'}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {userSkills.length === 0 && !uploading && (
        <div className="bg-[#0d0d0d] border border-dashed border-white/10 rounded-2xl p-8 text-center">
          <Upload size={36} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No skills yet. Upload your resume to let AI extract them automatically.</p>
        </div>
      )}
    </div>
  )
}

export default ProfilePage

// ── RoadmapPage ──────────────────────────────────────────────────
export function RoadmapPage() {
  const [roadmap, setRoadmap] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users/roadmap')
      .then(r => setRoadmap(r.data.steps || []))
      .catch(() => setRoadmap([]))
      .finally(() => setLoading(false))
  }, [])

  async function toggleStep(id, done) {
    await api.patch(`/users/roadmap/${id}`, { completed: !done })
    setRoadmap(prev => prev.map(s => s.id === id ? { ...s, completed: !done } : s))
  }

  const completed = roadmap.filter(s => s.completed).length
  const progress = roadmap.length > 0 ? Math.round((completed / roadmap.length) * 100) : 0

  return (
    <div className="max-w-3xl space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-[#7F56D9] animate-spin" />
        </div>
      ) : roadmap.length === 0 ? (
        <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-12 text-center">
          <Map size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-white font-semibold text-lg mb-2">No roadmap yet</p>
          <p className="text-gray-500 text-sm mb-5">
            Analyse your skill gap against a job to auto-generate a personalized learning roadmap, or use the AI Career Advisor.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a href="/skill-gap" className="bg-[#FF4D21] hover:bg-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
              Analyse Skill Gap
            </a>
            <a href="/career-advisor" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
              AI Career Advisor
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold">Overall Progress</p>
              <span className="text-[#7F56D9] font-bold">{progress}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full">
              <div
                className="h-full bg-[#7F56D9] rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-600 text-xs mt-2">{completed} of {roadmap.length} steps completed</p>
          </div>

          {/* Steps timeline */}
          <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6">
            <div className="relative">
              <div className="absolute left-5 top-6 bottom-6 w-px bg-white/5" />
              <div className="space-y-5">
                {roadmap.map((step, i) => {
                  const isUnlocked = i === 0 || roadmap[i - 1]?.completed
                  return (
                    <div key={step.id} className="flex gap-4 relative">
                      <button
                        onClick={() => isUnlocked && toggleStep(step.id, step.completed)}
                        disabled={!isUnlocked}
                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-all z-10 ${
                          step.completed
                            ? 'border-green-500 bg-green-500/20 text-green-500'
                            : isUnlocked
                              ? 'border-[#7F56D9] bg-[#7F56D9]/10 text-[#7F56D9] hover:bg-[#7F56D9]/20'
                              : 'border-white/10 bg-white/5 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {step.completed ? <CheckCircle size={18} /> : isUnlocked ? <Circle size={18} /> : <Lock size={16} />}
                      </button>
                      <div className={`flex-1 p-4 rounded-xl border transition-all ${
                        step.completed ? 'bg-green-500/5 border-green-500/20' : 'bg-white/3 border-white/5 hover:border-white/10'
                      }`}>
                        <div className="flex items-center justify-between gap-2">
                          <p className={`font-semibold text-sm ${step.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                            {step.title || step.learning_paths?.title}
                          </p>
                          <span className="text-xs text-gray-600 shrink-0">
                            {step.estimated_time || step.learning_paths?.duration}
                          </span>
                        </div>
                        {(step.resource_url || step.learning_paths?.url) && (
                          <a
                            href={step.resource_url || step.learning_paths?.url}
                            target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[#7F56D9] text-xs hover:underline mt-1.5"
                          >
                            <BookOpen size={11} />
                            View resource
                            <ExternalLink size={10} />
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

// ── JobsPage ──────────────────────────────────────────────────────
export function JobsPage() {
  const [jobs, setJobs]         = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading]   = useState(true)
  const [applying, setApplying] = useState(null)
  const [search, setSearch]     = useState('')

  useEffect(() => {
    api.get('/jobs/recommendations')
      .then(r => {
        const data = r.data.jobs || []
        setJobs(data)
        setFiltered(data)
      })
      .catch(() => { setJobs([]); setFiltered([]) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(jobs.filter(j =>
      j.title?.toLowerCase().includes(q) ||
      j.company?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q) ||
      j.skills?.some(s => s.toLowerCase().includes(q))
    ))
  }, [search, jobs])

  async function apply(jobId) {
    setApplying(jobId)
    try {
      await api.post('/jobs/apply', { jobId })
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, applied: true } : j))
    } catch {}
    finally { setApplying(null) }
  }

  const scoreColor = s => s >= 80 ? 'bg-green-500/10 text-green-400 border-green-500/20' : s >= 60 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-white/5 text-gray-400 border-white/10'

  return (
    <div className="max-w-5xl space-y-5">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, company, location or skill..."
          className="w-full bg-[#0d0d0d] border border-white/5 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4D21] focus:ring-1 focus:ring-[#FF4D21] transition-all"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-[#FF4D21] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-12 text-center">
          <Briefcase size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-white font-semibold mb-2">{search ? 'No jobs match your search' : 'No jobs matched yet'}</p>
          <p className="text-gray-500 text-sm">{search ? 'Try different keywords.' : 'Upload your resume to get AI-matched job recommendations.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-gray-600 text-xs">{filtered.length} {filtered.length === 1 ? 'role' : 'roles'} found</p>
          {filtered.map(job => (
            <div key={job.id} className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-white font-bold text-base">{job.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${scoreColor(job.matchScore)}`}>
                      {job.matchScore}% match
                    </span>
                    {job.applied && (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-green-500/10 text-green-400 border-green-500/20">Applied ✓</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">
                    {job.company && <span className="font-medium text-gray-400">{job.company}</span>}
                    {job.location && <span> · 📍 {job.location}</span>}
                  </p>
                  {job.salaryRange && (
                    <p className="text-green-400 text-xs font-medium mt-1">💰 {job.salaryRange}</p>
                  )}
                  {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.skills.slice(0, 6).map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-lg bg-[#FF4D21]/10 text-[#FF4D21] border border-[#FF4D21]/20">{s}</span>
                      ))}
                      {job.skills.length > 6 && <span className="text-xs text-gray-600">+{job.skills.length - 6} more</span>}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => apply(job.id)}
                  disabled={job.applied || applying === job.id}
                  className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    job.applied
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-not-allowed'
                      : 'bg-[#FF4D21] hover:bg-orange-500 text-white hover:shadow-lg hover:shadow-[#FF4D21]/20'
                  }`}
                >
                  {job.applied ? 'Applied' : applying === job.id ? '...' : 'Apply Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── RecruiterPage ───────────────────────────────────────────────
export function RecruiterPage() {
  return (
    <div className="max-w-2xl">
      <div className="bg-gradient-to-r from-[#7F56D9]/10 to-[#FF4D21]/5 border border-[#7F56D9]/20 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#7F56D9]/20 flex items-center justify-center mx-auto mb-5">
          <Briefcase size={28} className="text-[#7F56D9]" />
        </div>
        <h1 className="text-white font-bold text-2xl mb-2">Recruiter Dashboard</h1>
        <p className="text-gray-400 mb-6">Post jobs and find AI-matched candidates for your open roles.</p>
        <div className="inline-flex items-center gap-2 bg-[#7F56D9]/10 border border-[#7F56D9]/20 rounded-full px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-[#7F56D9] animate-pulse" />
          <span className="text-[#7F56D9] text-sm font-medium">Coming in Phase 2</span>
        </div>
      </div>
    </div>
  )
}

// ── NotFoundPage ───────────────────────────────────────────────
export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="text-center">
        <p className="text-[160px] font-black text-white/5 leading-none">404</p>
        <p className="text-white font-bold text-2xl -mt-4">Page not found</p>
        <p className="text-gray-500 text-sm mt-2 mb-6">The page you're looking for doesn't exist.</p>
        <a href="/dashboard" className="bg-[#FF4D21] hover:bg-orange-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all inline-block">
          Back to Dashboard
        </a>
      </div>
    </div>
  )
}
