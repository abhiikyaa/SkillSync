import { useState } from 'react'
import api from '../lib/api'
import { BrainCircuit, Loader2, MapPin, IndianRupee, Building2, Target, ChevronRight, Sparkles, Map } from 'lucide-react'

export default function CareerAdvisorPage() {
  const [form, setForm] = useState({ yearsOfExperience: '', currentRole: '' })
  const [recommendations, setRecommendations] = useState([])
  const [selectedRole, setSelectedRole] = useState(null)
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(false)
  const [roadmapLoading, setRoadmapLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasResults, setHasResults] = useState(false)

  async function handleGetRecommendations() {
    setError('')
    setLoading(true)
    setRecommendations([])
    setRoadmap(null)
    setSelectedRole(null)
    try {
      const { data } = await api.post('/ai/career-recommendations', {
        yearsOfExperience: parseInt(form.yearsOfExperience) || 0,
        currentRole: form.currentRole
      })
      setRecommendations(data.recommendations || [])
      setHasResults(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not get recommendations. Please upload your resume first.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGetRoadmap(role) {
    setSelectedRole(role)
    setRoadmap(null)
    setRoadmapLoading(true)
    try {
      const { data } = await api.post('/ai/full-roadmap', {
        targetRole: role.role,
        yearsOfExperience: parseInt(form.yearsOfExperience) || 0
      })
      setRoadmap(data.roadmap)
    } catch {
      setError('Could not generate roadmap. Try again.')
    } finally {
      setRoadmapLoading(false)
    }
  }

  const matchColor = (pct) => {
    if (pct >= 80) return { bar: 'bg-green-500', text: 'text-green-400', badge: 'bg-green-500/10 text-green-400 border-green-500/20' }
    if (pct >= 60) return { bar: 'bg-yellow-500', text: 'text-yellow-400', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' }
    return { bar: 'bg-[#FF4D21]', text: 'text-[#FF4D21]', badge: 'bg-[#FF4D21]/10 text-[#FF4D21] border-[#FF4D21]/20' }
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header card */}
      <div className="bg-gradient-to-r from-[#7F56D9]/10 to-[#FF4D21]/5 border border-[#7F56D9]/20 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-white font-bold text-xl flex items-center gap-2">
              <BrainCircuit size={20} className="text-[#7F56D9]" />
              AI Career Advisor
              <span className="text-[10px] bg-[#7F56D9]/20 text-[#7F56D9] px-2 py-0.5 rounded-full border border-[#7F56D9]/20 font-medium">India Market</span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">Get AI-powered job role recommendations tailored for the Indian tech market based on your skills.</p>
          </div>
          <Sparkles size={32} className="text-[#7F56D9]/40 shrink-0" />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="number"
              min="0" max="30"
              placeholder="Years of experience"
              value={form.yearsOfExperience}
              onChange={e => setForm({ ...form, yearsOfExperience: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#7F56D9] focus:ring-1 focus:ring-[#7F56D9] transition-all"
            />
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Current role (optional)"
              value={form.currentRole}
              onChange={e => setForm({ ...form, currentRole: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#7F56D9] focus:ring-1 focus:ring-[#7F56D9] transition-all"
            />
          </div>
          <button
            onClick={handleGetRecommendations}
            disabled={loading}
            className="sm:w-48 bg-[#7F56D9] hover:bg-violet-500 disabled:opacity-40 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-[#7F56D9]/20"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><Sparkles size={16} /> Analyse Career</>}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      </div>

      {/* Results */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Target size={16} className="text-[#FF4D21]" />
            Top Career Recommendations for India
          </h3>

          <div className="space-y-3">
            {recommendations.map((rec, i) => {
              const colors = matchColor(rec.matchPercentage)
              return (
                <div key={i} className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-white font-bold text-lg">{rec.role}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colors.badge}`}>
                          {rec.matchPercentage}% match
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                          #{i + 1} recommendation
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">{rec.description}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-white/5 rounded-full mb-4">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
                      style={{ width: `${rec.matchPercentage}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    {/* Salary */}
                    <div className="flex items-center gap-2 text-sm">
                      <IndianRupee size={14} className="text-green-400 shrink-0" />
                      <div>
                        <p className="text-gray-600 text-xs">Avg Salary</p>
                        <p className="text-white font-medium text-sm">{rec.avgSalaryIndia}</p>
                      </div>
                    </div>

                    {/* Companies */}
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 size={14} className="text-blue-400 shrink-0" />
                      <div>
                        <p className="text-gray-600 text-xs">Top Companies</p>
                        <p className="text-white font-medium text-sm">{rec.topCompanies?.join(', ')}</p>
                      </div>
                    </div>

                    {/* Missing skills */}
                    <div className="flex items-start gap-2 text-sm">
                      <Target size={14} className="text-[#FF4D21] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-600 text-xs">Skills to Learn</p>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {rec.missingSkills?.map(s => (
                            <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-[#FF4D21]/10 text-[#FF4D21] border border-[#FF4D21]/20">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleGetRoadmap(rec)}
                    className="flex items-center gap-2 text-sm text-[#7F56D9] hover:text-violet-400 font-medium transition-colors"
                  >
                    <Map size={14} />
                    Generate full roadmap for this role
                    <ChevronRight size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Full Roadmap */}
      {(roadmapLoading || roadmap) && (
        <div className="bg-[#0d0d0d] border border-[#7F56D9]/20 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
            <Map size={18} className="text-[#7F56D9]" />
            Full Learning Roadmap
            {selectedRole && <span className="text-gray-400 font-normal text-sm">— {selectedRole.role}</span>}
          </h3>

          {roadmapLoading ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <Loader2 size={32} className="text-[#7F56D9] animate-spin" />
              <p className="text-gray-500 text-sm">Gemini is generating your personalized roadmap...</p>
            </div>
          ) : roadmap && (
            <div className="space-y-6 mt-5">
              <div className="flex items-center gap-2 bg-[#7F56D9]/10 border border-[#7F56D9]/20 rounded-xl px-4 py-2.5 w-fit">
                <Sparkles size={14} className="text-[#7F56D9]" />
                <span className="text-[#7F56D9] text-sm font-medium">Total Duration: {roadmap.totalDuration}</span>
              </div>

              {roadmap.phases?.map((phase, pi) => (
                <div key={pi} className="relative">
                  {/* Phase connector */}
                  {pi < roadmap.phases.length - 1 && (
                    <div className="absolute left-5 top-full h-6 w-px bg-[#7F56D9]/30" />
                  )}

                  <div className="border border-white/5 rounded-2xl overflow-hidden">
                    {/* Phase header */}
                    <div className="bg-[#7F56D9]/10 border-b border-[#7F56D9]/20 px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#7F56D9] flex items-center justify-center text-white font-bold text-sm">
                          {phase.phase}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{phase.title}</p>
                          <p className="text-gray-500 text-xs">{phase.duration}</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs max-w-xs text-right hidden sm:block">{phase.goal}</p>
                    </div>

                    {/* Steps */}
                    <div className="p-4 space-y-3">
                      {phase.steps?.map((step, si) => (
                        <div key={si} className="flex gap-3">
                          <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px] text-gray-500 shrink-0 mt-0.5">
                            {si + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-white text-sm font-medium">{step.title}</p>
                              <span className="text-[10px] text-gray-600 shrink-0 mt-0.5">{step.estimatedTime}</span>
                            </div>
                            <p className="text-gray-500 text-xs mt-0.5">{step.description}</p>
                            {step.resourceUrl && (
                              <a href={step.resourceUrl} target="_blank" rel="noreferrer"
                                className="text-[#7F56D9] text-xs hover:underline mt-1 inline-block">
                                Open resource →
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && !hasResults && (
        <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl p-12 text-center">
          <BrainCircuit size={48} className="text-[#7F56D9]/40 mx-auto mb-4" />
          <p className="text-white font-semibold text-lg mb-2">Ready to discover your ideal career path?</p>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Enter your experience and click "Analyse Career" — our AI will evaluate your skills and recommend the top 5 roles in the Indian tech market for you.
          </p>
          <p className="text-gray-600 text-xs mt-4">
            💡 Make sure you've uploaded your resume first so AI knows your skills.
          </p>
        </div>
      )}
    </div>
  )
}
