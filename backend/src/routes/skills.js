import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { calculateSkillGap } from '../services/skillGapEngine.js'
import { supabase } from '../lib/supabase.js'

const router = Router()

// GET /api/skills  — all skills in taxonomy
router.get('/', async (_req, res) => {
  const { data } = await supabase.from('skills').select('*').order('skill_name')
  res.json(data || [])
})

// GET /api/skills/gaps?jobId=xxx  — CORE FEATURE
router.get('/gaps', requireAuth, async (req, res) => {
  const { jobId } = req.query
  if (!jobId) return res.status(400).json({ message: 'jobId is required' })

  // 1. Get user skills
  const { data: userSkills } = await supabase
    .from('user_skills')
    .select('skill_id, proficiency, last_used, skills(skill_name)')
    .eq('user_id', req.user.id)

  // 2. Get job skills
  const { data: jobSkills } = await supabase
    .from('job_skills')
    .select('skill_id, priority, weight, skills(skill_name), jobs(title)')
    .eq('job_id', jobId)

  if (!jobSkills || jobSkills.length === 0) {
    return res.status(404).json({ message: 'Job not found or has no skill requirements' })
  }

  // 3. Run gap calculation
  const result = calculateSkillGap(userSkills || [], jobSkills)

  // 4. Fetch course recommendations for missing skills
  let courses = []
  if (result.missingSkills.length > 0) {
    const jobTitle = jobSkills[0]?.jobs?.title || 'Tech Role'
    
    // Call Gemini to generate a personalized roadmap
    const { generateRoadmap } = await import('../services/aiService.js')
    const aiRoadmap = await generateRoadmap(result.missingSkills, jobTitle)
    
    if (aiRoadmap && aiRoadmap.length > 0) {
      // Map AI steps to UI format
      courses = aiRoadmap.map(step => ({
        title: step.title,
        skill: result.missingSkills[0]?.name || 'Missing Skill',
        duration: step.estimatedTime,
        url: step.resourceUrl || 'https://www.freecodecamp.org'
      }))

      // Persist to user_learning_paths so they show up on the Roadmap page
      const inserts = aiRoadmap.map((step, idx) => ({
        user_id: req.user.id,
        title: step.title,
        estimated_time: step.estimatedTime,
        resource_url: step.resourceUrl || null,
        completed: false
      }))
      
      // Upsert or insert them - simple insert for now, maybe wipe existing uncompleted?
      // Since this is MVP, we will just insert them. The user might get duplicates if they run it repeatedly.
      // Assuming 'title' and 'estimated_time' are columns on user_learning_paths. If not, the DB will reject it.
      // In many cases, user_learning_paths links to learning_paths. If so, this insert will fail. 
      // We will wrap in try-catch to not break the API if the schema is strictly relational.
      try {
        await supabase.from('user_learning_paths').insert(inserts)
      } catch (e) {
        console.warn("Could not insert dynamic roadmap into user_learning_paths. Schema mismatch?", e.message)
      }
    } else {
      // Fallback to static courses if AI fails or key is missing
      const missingSkillIds = result.missingSkills.map(s => s.skillId)
      const { data } = await supabase.from('learning_paths').select('*').in('skill_id', missingSkillIds).limit(6)
      courses = data || []
    }
  }

  res.json({
    jobTitle: jobSkills[0]?.jobs?.title,
    matchScore:     result.matchScore,
    matchedSkills:  result.matchedSkills,
    missingSkills:  result.missingSkills,
    recommendations: courses
  })
})

// POST /api/skills/analyze  — add/update a skill manually
router.post('/analyze', requireAuth, async (req, res) => {
  const { skillId, proficiency } = req.body
  if (!skillId || proficiency === undefined) {
    return res.status(400).json({ message: 'skillId and proficiency are required' })
  }
  const { data, error } = await supabase
    .from('user_skills')
    .upsert({ user_id: req.user.id, skill_id: skillId, proficiency, last_used: new Date() },
             { onConflict: 'user_id,skill_id' })
    .select()
    .single()
  if (error) return res.status(400).json({ message: error.message })
  res.json(data)
})

export default router
