import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'
import { getJobRecommendations } from '../services/matchingEngine.js'

const router = Router()

// GET /api/jobs — all jobs (with optional search)
router.get('/', requireAuth, async (req, res) => {
  const { search, location } = req.query
  let query = supabase.from('jobs').select('*, job_skills(skill_id, skills(skill_name))').eq('is_active', true)
  if (search)   query = query.ilike('title', `%${search}%`)
  if (location) query = query.ilike('location', `%${location}%`)
  const { data, error } = await query.order('created_at', { ascending: false }).limit(50)
  if (error) return res.status(400).json({ message: error.message })
  res.json({ jobs: data || [] })
})

// GET /api/jobs/recommendations — AI-matched jobs for current user
router.get('/recommendations', requireAuth, async (req, res) => {
  const { data: userSkills } = await supabase
    .from('user_skills')
    .select('skill_id, proficiency, skills(skill_name)')
    .eq('user_id', req.user.id)

  const { data: allJobs } = await supabase
    .from('jobs')
    .select('*, job_skills(skill_id, weight, skills(skill_name))')
    .eq('is_active', true)

  const ranked = getJobRecommendations(userSkills || [], allJobs || [])
  res.json({ jobs: ranked })
})

// POST /api/jobs  — recruiter creates job
router.post('/', requireAuth, requireRole('recruiter', 'admin'), async (req, res) => {
  const { title, description, salaryRange, location, skills } = req.body
  if (!title || !skills?.length) {
    return res.status(400).json({ message: 'title and skills are required' })
  }

  const { data: job, error } = await supabase
    .from('jobs')
    .insert({ recruiter_id: req.user.id, title, description, salary_range: salaryRange, location, is_active: true })
    .select()
    .single()
  if (error) return res.status(400).json({ message: error.message })

  // Insert job skills
  const jobSkills = skills.map(s => ({ job_id: job.id, skill_id: s.skillId, weight: s.weight || 1, priority: s.priority || 'medium' }))
  await supabase.from('job_skills').insert(jobSkills)

  res.status(201).json(job)
})

// POST /api/jobs/apply
router.post('/apply', requireAuth, async (req, res) => {
  const { jobId } = req.body
  if (!jobId) return res.status(400).json({ message: 'jobId required' })

  // Check not already applied
  const { data: existing } = await supabase
    .from('applications')
    .select('id')
    .eq('user_id', req.user.id)
    .eq('job_id', jobId)
    .single()
  if (existing) return res.status(409).json({ message: 'Already applied' })

  const { data, error } = await supabase
    .from('applications')
    .insert({ user_id: req.user.id, job_id: jobId, status: 'applied' })
    .select()
    .single()
  if (error) return res.status(400).json({ message: error.message })
  res.status(201).json(data)
})

export default router
