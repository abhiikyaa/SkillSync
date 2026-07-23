import { useState, useEffect } from 'react'
import api from '../lib/api'
import {
  Target, BookOpen, AlertCircle, ChevronDown, Loader2,
  CheckCircle, TrendingUp, Sparkles, ExternalLink, Clock, Globe
} from 'lucide-react'

// ── Derive a friendly platform name + colour from a URL ──────────────
function getPlatformInfo(url) {
  if (!url) return { name: 'Resource', color: '#958da1', bg: 'rgba(149,141,161,0.1)' }
  const u = url.toLowerCase()
  if (u.includes('freecodecamp'))  return { name: 'freeCodeCamp',  color: '#4cd7f6', bg: 'rgba(76,215,246,0.08)' }
  if (u.includes('coursera'))      return { name: 'Coursera',      color: '#d2bbff', bg: 'rgba(210,187,255,0.08)' }
  if (u.includes('udemy'))         return { name: 'Udemy',         color: '#ffb4ab', bg: 'rgba(255,180,171,0.08)' }
  if (u.includes('youtube'))       return { name: 'YouTube',       color: '#ffb4ab', bg: 'rgba(255,180,171,0.08)' }
  if (u.includes('docs.'))         return { name: 'Official Docs', color: '#adc6ff', bg: 'rgba(173,198,255,0.08)' }
  if (u.includes('developer.'))    return { name: 'Official Docs', color: '#adc6ff', bg: 'rgba(173,198,255,0.08)' }
  if (u.includes('github'))        return { name: 'GitHub',        color: '#ccc3d8', bg: 'rgba(204,195,216,0.08)' }
  if (u.includes('leetcode'))      return { name: 'LeetCode',      color: '#4cd7f6', bg: 'rgba(76,215,246,0.08)' }
  if (u.includes('pluralsight'))   return { name: 'Pluralsight',   color: '#d2bbff', bg: 'rgba(210,187,255,0.08)' }
  if (u.includes('linkedin'))      return { name: 'LinkedIn Learning', color: '#adc6ff', bg: 'rgba(173,198,255,0.08)' }
  if (u.includes('w3schools'))     return { name: 'W3Schools',     color: '#4cd7f6', bg: 'rgba(76,215,246,0.08)' }
  if (u.includes('mdn') || u.includes('mozilla')) return { name: 'MDN Docs', color: '#adc6ff', bg: 'rgba(173,198,255,0.08)' }
  try {
    const domain = new URL(url).hostname.replace('www.', '').split('.')[0]
    return { name: domain.charAt(0).toUpperCase() + domain.slice(1), color: '#958da1', bg: 'rgba(149,141,161,0.08)' }
  } catch {
    return { name: 'Resource', color: '#958da1', bg: 'rgba(149,141,161,0.08)' }
  }
}

export default function SkillGapPage() {
  const [jobs, setJobs]               = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [result, setResult]           = useState(null)
  const [loading, setLoading]         = useState(false)
  const [jobsLoading, setJobsLoading] = useState(true)
  const [error, setError]             = useState('')

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { data } = await api.get('/jobs')
        setJobs(data.jobs || [])
      } catch (err) {
        console.error('Failed to load jobs:', err)
        setError('Failed to load available jobs')
        setJobs([])
      } finally {
        setJobsLoading(false)
      }
    }
    fetchJobs()
  }, [])

  async function analyse() {
    if (!selectedJob) return setError('Please select a job to analyse')
    setError(''); setLoading(true); setResult(null)
    try {
      const { data } = await api.get(`/skills/gaps?jobId=${selectedJob.id}`)
      setResult(data)
    } catch {
      setError('Could not analyse skill gap. Make sure you have uploaded your resume first.')
    } finally {
      setLoading(false)
    }
  }

  const scoreGlow  = result?.matchScore >= 80 ? 'rgba(76,215,246,0.2)'    : result?.matchScore >= 60 ? 'rgba(210,187,255,0.15)' : 'rgba(124,58,237,0.15)'
  const scoreColor = result?.matchScore >= 80 ? '#4cd7f6'                  : result?.matchScore >= 60 ? '#d2bbff'                : '#adc6ff'
  const barGrad    = result?.matchScore >= 80 ? 'linear-gradient(90deg, #0566d9, #4cd7f6)'
                   : result?.matchScore >= 60 ? 'linear-gradient(90deg, #7c3aed, #d2bbff)'
                   :                            'linear-gradient(90deg, #7c3aed, #0566d9)'

  return (
    <div className="max-w-5xl space-y-6 animate-fade-in">

      {/* Job Selector */}
      <div className="glass-card p-6">
        <h2 className="font-display font-semibold text-base flex items-center gap-2 mb-1" style={{ color: '#dae2fd' }}>
          <Target size={16} style={{ color: '#d2bbff' }} /> Select a Job to Analyse
        </h2>
        <p className="text-sm mb-5" style={{ color: '#958da1' }}>
          Pick any role and see exactly how you stack up against its requirements.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" size={16} style={{ color: '#958da1' }} />
            <select
              value={selectedJob?.id || ''}
              onChange={e => { setSelectedJob(jobs.find(j => j.id === e.target.value) || null); setResult(null); setError('') }}
              className="w-full appearance-none aether-input pr-10 cursor-pointer"
              style={{ background: '#0b1326' }}
            >
              <option value="" style={{ background: '#131b2e' }}>
                {jobsLoading ? 'Loading jobs...' : jobs.length === 0 ? 'No jobs available' : '— Select a job role —'}
              </option>
              {jobs.map(j => (
                <option key={j.id} value={j.id} style={{ background: '#131b2e' }}>
                  {j.title}{j.company ? ` — ${j.company}` : ''}{j.location ? ` (${j.location})` : ''}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={analyse}
            disabled={loading || !selectedJob}
            className="btn-glow sm:w-40 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><TrendingUp size={15} /> Analyse</>}
          </button>
        </div>

        {error && (
          <p className="text-sm mt-3 flex items-center gap-2" style={{ color: '#ffb4ab' }}>
            <AlertCircle size={14} />{error}
          </p>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-5 animate-fade-in">

          {/* Score Banner */}
          <div className="glass-card p-6" style={{ borderColor: `${scoreColor}30`, boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${scoreGlow}` }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="label-caps mb-1" style={{ color: '#958da1' }}>Match Score for</p>
                <p className="font-display font-bold text-xl" style={{ color: '#dae2fd' }}>{result.jobTitle || selectedJob?.title}</p>
              </div>
              <p className="font-display font-bold" style={{ fontSize: '56px', color: scoreColor, lineHeight: 1 }}>{result.matchScore}%</p>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${result.matchScore}%`, background: barGrad, boxShadow: `0 0 8px ${scoreColor}60` }} />
            </div>
            <p className="text-xs mt-2" style={{ color: '#958da1' }}>
              {result.matchScore >= 80 ? "🎉 Excellent match! You're highly qualified."
                : result.matchScore >= 60 ? '👍 Good match. A few gaps to bridge.'
                : '⚡ Work on the missing skills below to qualify.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Matched Skills */}
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-sm flex items-center gap-2 mb-4" style={{ color: '#dae2fd' }}>
                <CheckCircle size={15} style={{ color: '#4cd7f6' }} />
                Skills You Have ({result.matchedSkills?.length || 0})
              </h3>
              {result.matchedSkills?.length === 0 ? (
                <p className="text-sm" style={{ color: '#4a4455' }}>No matching skills. Upload your resume first.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills?.map(s => (
                    <span key={s.name} className="ai-chip ai-chip-cyan">
                      {s.name}
                      {s.proficiency && <span className="opacity-60 text-[10px]"> · {s.proficiency}</span>}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Missing Skills */}
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-sm flex items-center gap-2 mb-4" style={{ color: '#dae2fd' }}>
                <AlertCircle size={15} style={{ color: '#ffb4ab' }} />
                Skills to Acquire ({result.missingSkills?.length || 0})
              </h3>
              {result.missingSkills?.length === 0 ? (
                <p className="text-sm flex items-center gap-2" style={{ color: '#4cd7f6' }}>
                  <CheckCircle size={13} /> You have all required skills!
                </p>
              ) : (
                <div className="space-y-2">
                  {result.missingSkills?.map(s => (
                    <div key={s.name} className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: 'rgba(34,42,61,0.5)', border: '1px solid rgba(74,68,85,0.3)' }}>
                      <p className="text-sm font-medium" style={{ color: '#dae2fd' }}>{s.name}</p>
                      <span className="ai-chip" style={{ fontSize: '10px' }}>{s.priority}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Learning Roadmap with platform links */}
          {result.recommendations?.length > 0 && (
            <div className="glass-card p-6" style={{ borderColor: 'rgba(124,58,237,0.25)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-semibold text-sm flex items-center gap-2" style={{ color: '#dae2fd' }}>
                  <BookOpen size={15} style={{ color: '#d2bbff' }} />
                  AI-Generated Learning Roadmap
                </h3>
                <span className="ai-chip"><Sparkles size={11} /> Gemini AI</span>
              </div>

              <div className="space-y-3">
                {result.recommendations.map((r, i) => {
                  const platform = getPlatformInfo(r.url)
                  const hasLink  = r.url && r.url !== '#'

                  return (
                    <div key={i} className="rounded-xl overflow-hidden"
                      style={{ background: 'rgba(34,42,61,0.5)', border: '1px solid rgba(74,68,85,0.3)' }}>

                      <div className="flex items-start gap-4 p-4">
                        {/* Step number */}
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                          style={{ background: 'rgba(124,58,237,0.2)', color: '#d2bbff' }}>
                          {i + 1}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold mb-1" style={{ color: '#dae2fd' }}>{r.title}</p>

                          {r.description && (
                            <p className="text-xs mb-2 leading-relaxed" style={{ color: '#958da1' }}>{r.description}</p>
                          )}

                          <div className="flex items-center flex-wrap gap-2 mt-1">
                            {r.duration && (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                                style={{ background: 'rgba(74,68,85,0.4)', color: '#958da1' }}>
                                <Clock size={10} /> {r.duration}
                              </span>
                            )}

                            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium"
                              style={{ background: platform.bg, color: platform.color, border: `1px solid ${platform.color}30` }}>
                              <Globe size={10} /> {platform.name}
                            </span>
                          </div>
                        </div>

                        {/* Open link button */}
                        {hasLink && (
                          <a href={r.url} target="_blank" rel="noreferrer"
                            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                            style={{
                              background: 'rgba(124,58,237,0.15)',
                              border: '1px solid rgba(124,58,237,0.3)',
                              color: '#d2bbff',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.3)'; e.currentTarget.style.color = '#fff' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.15)'; e.currentTarget.style.color = '#d2bbff' }}
                          >
                            <ExternalLink size={12} /> Open Course
                          </a>
                        )}
                      </div>

                      {/* Full URL bar at bottom */}
                      {hasLink && (
                        <div className="px-4 py-2 flex items-center gap-2"
                          style={{ background: 'rgba(11,19,38,0.5)', borderTop: '1px solid rgba(74,68,85,0.2)' }}>
                          <Globe size={10} style={{ color: '#4a4455' }} />
                          <span className="text-xs truncate" style={{ color: '#4a4455' }}>{r.url}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}