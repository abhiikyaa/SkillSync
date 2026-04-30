import { useState, useEffect } from 'react'
import api from '../lib/api'
import { Target, BookOpen, AlertCircle, ChevronDown, Loader2, CheckCircle, TrendingUp } from 'lucide-react'

const PROFICIENCY_COLOR = {
  Beginner:     'bg-red-500/20 text-red-400 border-red-500/20',
  Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20',
  Advanced:     'bg-blue-500/20 text-blue-400 border-blue-500/20',
  Expert:       'bg-green-500/20 text-green-400 border-green-500/20',
}

export default function SkillGapPage() {
  const [jobs, setJobs]       = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [jobsLoading, setJobsLoading] = useState(true)
  const [error, setError]     = useState('')

  // Fetch all available jobs for dropdown
  useEffect(() => {
    api.get('/jobs')
      .then(r => setJobs(r.data.jobs || []))
      .catch(() => setJobs([]))
      .finally(() => setJobsLoading(false))
  }, [])

  async function analyse() {
    if (!selectedJob) return setError('Please select a job to analyse')
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const { data } = await api.get(`/skills/gaps?jobId=${selectedJob.id}`)
      setResult(data)
    } catch {
      setError('Could not analyse skill gap. Make sure you have uploaded your resume first.')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = result?.matchScore >= 80 ? 'text-green-400' : result?.matchScore >= 60 ? 'text-yellow-400' : 'text-red-400'
  const scoreBg = result?.matchScore >= 80 ? 'border-green-500/30 bg-green-500/5' : result?.matchScore >= 60 ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-red-500/30 bg-red-500/5'
  const barColor = result?.matchScore >= 80 ? 'bg-green-500' : result?.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="max-w-5xl space-y-6">
      {/* Job Selector Card */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-1 flex items-center gap-2">
          <Target size={16} className="text-[#FF4D21]" /> Select a Job to Analyse
        </h2>
        <p className="text-gray-500 text-sm mb-5">Pick any role from your matched jobs and see exactly how you stack up.</p>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Job dropdown */}
          <div className="relative flex-1">
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            <select
              value={selectedJob?.id || ''}
              onChange={e => {
                const job = jobs.find(j => j.id === e.target.value)
                setSelectedJob(job || null)
                setResult(null)
                setError('')
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-[#FF4D21] focus:ring-1 focus:ring-[#FF4D21] transition-all cursor-pointer"
            >
              <option value="" className="bg-[#121212] text-gray-400">
                {jobsLoading ? 'Loading jobs...' : jobs.length === 0 ? 'No jobs available — seed the DB first' : '— Select a job role —'}
              </option>
              {jobs.map(j => (
                <option key={j.id} value={j.id} className="bg-[#121212]">
                  {j.title} {j.company ? `— ${j.company}` : ''} {j.location ? `(${j.location})` : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={analyse}
            disabled={loading || !selectedJob}
            className="sm:w-40 bg-[#FF4D21] hover:bg-orange-500 disabled:opacity-40 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-[#FF4D21]/20"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><TrendingUp size={16} /> Analyse</>}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mt-3 flex items-center gap-2"><AlertCircle size={14} />{error}</p>}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-5 animate-in fade-in duration-500">
          {/* Score Banner */}
          <div className={`bg-[#0d0d0d] border rounded-2xl p-6 ${scoreBg}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Match Score for</p>
                <p className="text-white font-bold text-xl">{result.jobTitle || selectedJob?.title}</p>
              </div>
              <div className="text-right">
                <p className={`text-6xl font-bold ${scoreColor}`}>{result.matchScore}%</p>
              </div>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                style={{ width: `${result.matchScore}%` }}
              />
            </div>
            <p className="text-gray-500 text-xs mt-2">
              {result.matchScore >= 80 ? '🎉 Excellent match! You\'re highly qualified for this role.' 
               : result.matchScore >= 60 ? '👍 Good match. Upskill in a few areas to maximize your chances.' 
               : '⚡ Work on the missing skills below to qualify for this role.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Matched skills */}
            <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                Skills You Have ({result.matchedSkills?.length || 0})
              </h3>
              {result.matchedSkills?.length === 0 ? (
                <p className="text-gray-600 text-sm">No matching skills found. Upload your resume to add skills.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills?.map(s => (
                    <span key={s.name} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${PROFICIENCY_COLOR[s.proficiency] || 'bg-green-500/20 text-green-400 border-green-500/20'}`}>
                      {s.name}
                      {s.proficiency && <span className="opacity-60 text-[10px]">· {s.proficiency}</span>}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Missing skills */}
            <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle size={16} className="text-[#FF4D21]" />
                Skills to Acquire ({result.missingSkills?.length || 0})
              </h3>
              {result.missingSkills?.length === 0 ? (
                <p className="text-green-400 text-sm flex items-center gap-2"><CheckCircle size={14} /> You have all required skills!</p>
              ) : (
                <div className="space-y-2">
                  {result.missingSkills?.map(s => (
                    <div key={s.name} className="flex items-center justify-between p-3 bg-white/3 rounded-xl border border-white/5">
                      <p className="text-white text-sm font-medium">{s.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF4D21]/20 text-[#FF4D21] font-medium capitalize">{s.priority}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Roadmap */}
          {result.recommendations?.length > 0 && (
            <div className="bg-[#0d0d0d] border border-[#7F56D9]/20 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
                <BookOpen size={16} className="text-[#7F56D9]" />
                AI-Generated Learning Roadmap
                <span className="ml-auto text-[10px] bg-[#7F56D9]/20 text-[#7F56D9] px-2 py-0.5 rounded-full font-medium border border-[#7F56D9]/20">Gemini AI</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.recommendations.map((r, i) => (
                  <a key={i} href={r.url || '#'} target="_blank" rel="noreferrer"
                    className="flex items-start gap-3 p-4 rounded-xl border border-white/5 hover:border-[#7F56D9]/40 hover:bg-white/3 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#7F56D9]/20 flex items-center justify-center text-[#7F56D9] text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm group-hover:text-[#7F56D9] transition-colors">{r.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{r.duration || r.skill} {r.url && '· Click to open →'}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
