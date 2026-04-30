import { Router } from 'express'
import multer from 'multer'
import { requireAuth } from '../middleware/auth.js'
import { extractSkillsFromResume } from '../services/resumeParser.js'
import { supabase } from '../lib/supabase.js'

const router  = Router()
const upload  = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },   // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    cb(null, allowed.includes(file.mimetype))
  }
})

// GET /api/users/profile
router.get('/profile', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, user_skills(*, skills(*))')
    .eq('id', req.user.id)
    .single()
  if (error) return res.status(404).json({ message: 'Profile not found' })
  res.json(data)
})

// PUT /api/users/profile
router.put('/profile', requireAuth, async (req, res) => {
  const { name, bio, location, careerGoal } = req.body
  const { data, error } = await supabase
    .from('profiles')
    .update({ name, bio, location, career_goal: careerGoal, updated_at: new Date() })
    .eq('id', req.user.id)
    .select()
    .single()
  if (error) return res.status(400).json({ message: error.message })
  res.json(data)
})

// POST /api/users/resume  — upload + parse
router.post('/resume', requireAuth, upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded or invalid type' })

  // 1. Store file in Supabase Storage
  const filename = `${req.user.id}/resume-${Date.now()}.pdf`
  const { error: uploadErr } = await supabase.storage
    .from('resumes')
    .upload(filename, req.file.buffer, { contentType: req.file.mimetype, upsert: true })
  if (uploadErr) return res.status(500).json({ message: 'Storage upload failed' })

  // 2. Extract skills from resume text
  const extractedSkills = await extractSkillsFromResume(req.file.buffer)

  // 3. Save extracted skills to user_skills table
  if (extractedSkills.length > 0) {
    // Look up skill IDs from skills table
    const { data: skillRows } = await supabase
      .from('skills')
      .select('id, skill_name')
      .in('skill_name', extractedSkills.map(s => s.name))

    const inserts = skillRows?.map(row => ({
      user_id:     req.user.id,
      skill_id:    row.id,
      proficiency: 1,      // default Beginner
      last_used:   new Date()
    })) || []

    if (inserts.length > 0) {
      await supabase.from('user_skills').upsert(inserts, { onConflict: 'user_id,skill_id' })
    }
  }

  // 4. Update profile with resume URL
  await supabase.from('profiles')
    .update({ resume_url: filename })
    .eq('id', req.user.id)

  res.json({ message: 'Resume parsed', skillsExtracted: extractedSkills.length, skills: extractedSkills })
})

// GET /api/users/dashboard-stats
router.get('/dashboard-stats', requireAuth, async (req, res) => {
  const userId = req.user.id

  const [{ count: skillsCount }, { data: applications }, { data: roadmapSteps }] = await Promise.all([
    supabase.from('user_skills').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('applications').select('job_id').eq('user_id', userId),
    supabase.from('user_learning_paths').select('id, completed').eq('user_id', userId)
  ])

  const totalSteps = roadmapSteps?.length || 0
  const completedSteps = roadmapSteps?.filter(s => s.completed).length || 0
  const roadmapProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

  res.json({
    skillsCount: skillsCount || 0,
    jobsMatched: applications?.length || 0,
    roadmapProgress,
    totalRoadmapSteps: totalSteps,
    completedRoadmapSteps: completedSteps,
  })
})

// GET /api/users/roadmap
router.get('/roadmap', requireAuth, async (req, res) => {
  const { data } = await supabase
    .from('user_learning_paths')
    .select('*, learning_paths(*, skills(skill_name))')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: true })
  res.json({ steps: data || [] })
})

// PATCH /api/users/roadmap/:id
router.patch('/roadmap/:id', requireAuth, async (req, res) => {
  const { completed } = req.body
  const { data, error } = await supabase
    .from('user_learning_paths')
    .update({ completed, completed_at: completed ? new Date() : null })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)   // security — only own rows
    .select()
    .single()
  if (error) return res.status(400).json({ message: error.message })
  res.json(data)
})

export default router
