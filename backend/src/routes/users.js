import { Router } from 'express'
import multer from 'multer'
import { requireAuth } from '../middleware/auth.js'
import { extractSkillsFromResume } from '../services/resumeParser.js'
import { supabase } from '../lib/supabase.js'

const router  = Router()
const upload  = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
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
  const ext = req.file.mimetype === 'application/pdf' ? '.pdf' : '.docx'
  const filename = `${req.user.id}/resume-${Date.now()}${ext}`
  const { error: uploadErr } = await supabase.storage
    .from('resumes')
    .upload(filename, req.file.buffer, { contentType: req.file.mimetype, upsert: true })
  if (uploadErr) {
    console.error('Resume upload error:', uploadErr)
    return res.status(500).json({ message: `Storage upload failed: ${uploadErr.message}` })
  }

  // 2. Extract skills from resume text via AI
  let extractedSkills = []
  try {
    extractedSkills = await extractSkillsFromResume(req.file.buffer)
    console.log(`[Resume] AI extracted ${extractedSkills.length} skills:`, extractedSkills.map(s => s.name))
  } catch (err) {
    console.error('Skill extraction error:', err)
  }

  // 3. Match extracted skill names against the skills table
  //    Uses case-insensitive matching (ilike) so "node.js" matches "Node.js"
  if (extractedSkills.length > 0) {
    try {
      // Fetch ALL skills from DB once
      const { data: allSkills, error: skillErr } = await supabase
        .from('skills')
        .select('id, skill_name')

      if (skillErr) throw skillErr

      // Build a lowercase map for fuzzy matching
      const skillMap = new Map(
        allSkills.map(s => [s.skill_name.toLowerCase().trim(), s])
      )

      // Also build variations: "node.js" -> "nodejs", "vue.js" -> "vue" etc.
      const normalize = name => name.toLowerCase().trim()
        .replace(/\.js$/, '')     // react.js -> react
        .replace(/\s+/g, '')      // remove spaces

      const normalizedMap = new Map(
        allSkills.map(s => [normalize(s.skill_name), s])
      )

      // Match each extracted skill
      const matchedSkillRows = []
      const unmatchedSkills = []

      for (const extracted of extractedSkills) {
        const extractedLower = extracted.name.toLowerCase().trim()
        const extractedNorm = normalize(extracted.name)

        // Try exact lowercase match first
        let match = skillMap.get(extractedLower)

        // Try normalized match (removes .js suffix, spaces)
        if (!match) match = normalizedMap.get(extractedNorm)

        // Try partial match — DB skill name contains extracted name
        if (!match) {
          match = allSkills.find(s =>
            s.skill_name.toLowerCase().includes(extractedLower) ||
            extractedLower.includes(s.skill_name.toLowerCase())
          )
        }

        if (match) {
          matchedSkillRows.push(match)
        } else {
          unmatchedSkills.push(extracted.name)
        }
      }

      console.log(`[Resume] Matched ${matchedSkillRows.length}/${extractedSkills.length} skills to DB`)
      if (unmatchedSkills.length > 0) {
        console.log(`[Resume] Unmatched skills (not in DB taxonomy):`, unmatchedSkills)
      }

      // Insert matched skills into user_skills
      if (matchedSkillRows.length > 0) {
        const inserts = matchedSkillRows.map(row => ({
          user_id:     req.user.id,
          skill_id:    row.id,
          proficiency: 2,       // default Intermediate (more realistic than Beginner)
          last_used:   new Date()
        }))

        const { error: upsertErr } = await supabase
          .from('user_skills')
          .upsert(inserts, { onConflict: 'user_id,skill_id' })

        if (upsertErr) throw upsertErr
        console.log(`[Resume] Saved ${inserts.length} skills to user_skills`)
      }

    } catch (err) {
      console.error('Skill save error:', err)
    }
  }

  // 4. Update profile with resume URL
  try {
    await supabase.from('profiles')
      .update({ resume_url: filename })
      .eq('id', req.user.id)
  } catch (err) {
    console.error('Profile update error:', err)
  }

  res.json({
    message: 'Resume parsed',
    skillsExtracted: extractedSkills.length,
    skills: extractedSkills
  })
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
    .eq('user_id', req.user.id)
    .select()
    .single()
  if (error) return res.status(400).json({ message: error.message })
  res.json(data)
})

export default router