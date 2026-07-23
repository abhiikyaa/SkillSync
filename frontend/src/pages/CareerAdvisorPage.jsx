import { useState } from 'react'
import api from '../lib/api'
import { BrainCircuit, Loader2, IndianRupee, Building2, Target, ChevronRight, Sparkles, Map } from 'lucide-react'

export default function CareerAdvisorPage() {
  const [form, setForm]                   = useState({ yearsOfExperience: '', currentRole: '' })
  const [recommendations, setRecommendations] = useState([])
  const [selectedRole, setSelectedRole]   = useState(null)
  const [roadmap, setRoadmap]             = useState(null)
  const [loading, setLoading]             = useState(false)
  const [roadmapLoading, setRoadmapLoading] = useState(false)
  const [error, setError]                 = useState('')
  const [hasResults, setHasResults]       = useState(false)

  async function handleGetRecommendations() {
    setError(''); setLoading(true); setRecommendations([]); setRoadmap(null); setSelectedRole(null)
    try {
      const { data } = await api.post('/ai/career-recommendations', {
        yearsOfExperience: parseInt(form.yearsOfExperience) || 0,
        currentRole: form.currentRole,
      })
      setRecommendations(data.recommendations || [])
      setHasResults(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not get recommendations. Please upload your resume first.')
    } finally { setLoading(false) }
  }

  async function handleGetRoadmap(role) {
    setSelectedRole(role); setRoadmap(null); setRoadmapLoading(true)
    try {
      const { data } = await api.post('/ai/full-roadmap', { targetRole: role.role, yearsOfExperience: parseInt(form.yearsOfExperience) || 0 })
      setRoadmap(data.roadmap)
    } catch { setError('Could not generate roadmap. Try again.') }
    finally { setRoadmapLoading(false) }
  }

  const matchColor = pct =>
    pct >= 80 ? { bar: 'linear-gradient(90deg,#0566d9,#4cd7f6)', text: '#4cd7f6', border: 'rgba(76,215,246,0.3)' }
    : pct >= 60 ? { bar: 'linear-gradient(90deg,#7c3aed,#d2bbff)', text: '#d2bbff', border: 'rgba(210,187,255,0.3)' }
    : { bar: 'linear-gradient(90deg,#7c3aed,#0566d9)', text: '#adc6ff', border: 'rgba(173,198,255,0.3)' }

  return (
    <div className="max-w-5xl space-y-6 animate-fade-in">

      {/* Header card */}
      <div className="glass-card p-6" style={{ borderColor: 'rgba(124,58,237,0.25)', background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(5,102,217,0.05) 100%)' }}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-xl flex items-center gap-2 mb-1" style={{ color: '#dae2fd' }}>
              <BrainCircuit size={20} style={{ color: '#d2bbff' }} />
              AI Career Advisor
              <span className="ai-chip"><Sparkles size={10} /> India Market</span>
            </h2>
            <p className="text-sm" style={{ color: '#958da1' }}>Get AI-powered job role recommendations tailored for the Indian tech market based on your skills.</p>
          </div>
          <Sparkles size={32} style={{ color: 'rgba(124,58,237,0.3)', flexShrink: 0 }} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="number" min="0" max="30"
            placeholder="Years of experience"
            value={form.yearsOfExperience}
            onChange={e => setForm({ ...form, yearsOfExperience: e.target.value })}
            className="aether-input flex-1"
          />
          <input
            type="text"
            placeholder="Current role (optional)"
            value={form.currentRole}
            onChange={e => setForm({ ...form, currentRole: e.target.value })}
            className="aether-input flex-1"
          />
          <button onClick={handleGetRecommendations} disabled={loading} className="btn-glow sm:w-48 disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><Sparkles size={15} /> Analyse Career</>}
          </button>
        </div>

        {error && <p className="text-sm mt-3" style={{ color: '#ffb4ab' }}>{error}</p>}
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display font-semibold flex items-center gap-2" style={{ color: '#dae2fd' }}>
            <Target size={16} style={{ color: '#4cd7f6' }} /> Top Career Recommendations for India
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, i) => {
              const c = matchColor(rec.matchPercentage)
              return (
                <div key={i} className="glass-card p-5" style={{ borderColor: c.border }}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-display font-bold text-lg" style={{ color: '#dae2fd' }}>{rec.role}</h4>
                        <span className="ai-chip" style={{ color: c.text, borderColor: c.border, background: `${c.text}10` }}>
                          {rec.matchPercentage}% match
                        </span>
                        <span className="ai-chip">#{i + 1}</span>
                      </div>
                      <p className="text-sm" style={{ color: '#958da1' }}>{rec.description}</p>
                    </div>
                  </div>

                  <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${rec.matchPercentage}%`, background: c.bar }} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <IndianRupee size={14} style={{ color: '#4cd7f6', flexShrink: 0 }} />
                      <div>
                        <p className="label-caps" style={{ color: '#4a4455' }}>Avg Salary</p>
                        <p className="text-sm font-medium" style={{ color: '#dae2fd' }}>{rec.avgSalaryIndia}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 size={14} style={{ color: '#adc6ff', flexShrink: 0 }} />
                      <div>
                        <p className="label-caps" style={{ color: '#4a4455' }}>Top Companies</p>
                        <p className="text-sm font-medium" style={{ color: '#dae2fd' }}>{rec.topCompanies?.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target size={14} style={{ color: '#d2bbff', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <p className="label-caps" style={{ color: '#4a4455' }}>Skills to Learn</p>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {rec.missingSkills?.map(s => <span key={s} className="ai-chip" style={{ fontSize: '10px' }}>{s}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => handleGetRoadmap(rec)} className="flex items-center gap-2 text-sm font-medium transition-colors"
                    style={{ color: '#d2bbff' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#4cd7f6'}
                    onMouseLeave={e => e.currentTarget.style.color = '#d2bbff'}>
                    <Map size={14} /> Generate full roadmap <ChevronRight size={13} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Full Roadmap */}
      {(roadmapLoading || roadmap) && (
        <div className="glass-card p-6" style={{ borderColor: 'rgba(124,58,237,0.25)' }}>
          <h3 className="font-display font-bold text-lg mb-2 flex items-center gap-2" style={{ color: '#dae2fd' }}>
            <Map size={18} style={{ color: '#d2bbff' }} /> Full Learning Roadmap
            {selectedRole && <span className="text-sm font-normal" style={{ color: '#958da1' }}>— {selectedRole.role}</span>}
          </h3>

          {roadmapLoading ? (
            <div className="flex flex-col items-center py-10 gap-3">
              <Loader2 size={32} className="animate-spin" style={{ color: '#7c3aed' }} />
              <p className="text-sm" style={{ color: '#958da1' }}>Gemini is generating your personalized roadmap...</p>
            </div>
          ) : roadmap && (
            <div className="space-y-6 mt-5">
              <div className="ai-chip w-fit">
                <Sparkles size={12} /> Total Duration: {roadmap.totalDuration}
              </div>
              {roadmap.phases?.map((phase, pi) => (
                <div key={pi} className="relative">
                  {pi < roadmap.phases.length - 1 && (
                    <div className="absolute left-5 top-full h-6 w-px" style={{ background: 'rgba(124,58,237,0.3)' }} />
                  )}
                  <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(74,68,85,0.35)' }}>
                    <div className="px-5 py-3 flex items-center justify-between" style={{ background: 'rgba(124,58,237,0.1)', borderBottom: '1px solid rgba(124,58,237,0.2)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#7c3aed,#0566d9)' }}>{phase.phase}</div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: '#dae2fd' }}>{phase.title}</p>
                          <p className="text-xs" style={{ color: '#958da1' }}>{phase.duration}</p>
                        </div>
                      </div>
                      <p className="text-xs hidden sm:block text-right" style={{ color: '#958da1', maxWidth: '200px' }}>{phase.goal}</p>
                    </div>
                    <div className="p-4 space-y-3">
                      {phase.steps?.map((step, si) => (
                        <div key={si} className="flex gap-3">
                          <div className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 mt-0.5" style={{ borderColor: 'rgba(124,58,237,0.3)', color: '#958da1' }}>{si + 1}</div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium" style={{ color: '#dae2fd' }}>{step.title}</p>
                              <span className="text-[10px] shrink-0 mt-0.5" style={{ color: '#4a4455' }}>{step.estimatedTime}</span>
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: '#958da1' }}>{step.description}</p>
                            {step.resourceUrl && (
                              <a href={step.resourceUrl} target="_blank" rel="noreferrer" className="text-xs mt-1 inline-block transition-colors" style={{ color: '#d2bbff' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#4cd7f6'}
                                onMouseLeave={e => e.currentTarget.style.color = '#d2bbff'}>
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
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <BrainCircuit size={28} style={{ color: '#7c3aed' }} />
          </div>
          <p className="font-display font-semibold text-lg mb-2" style={{ color: '#dae2fd' }}>Ready to discover your ideal career path?</p>
          <p className="text-sm max-w-md mx-auto" style={{ color: '#958da1' }}>
            Enter your experience and click "Analyse Career" — our AI will recommend the top 5 roles in the Indian tech market for you.
          </p>
          <p className="text-xs mt-4" style={{ color: '#4a4455' }}>💡 Make sure you've uploaded your resume first so AI knows your skills.</p>
        </div>
      )}
    </div>
  )
}
