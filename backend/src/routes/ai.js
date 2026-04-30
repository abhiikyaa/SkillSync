import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { supabase } from '../lib/supabase.js'
import { getIndiaCareerRecommendations, generateFullRoadmap } from '../services/aiService.js'

const router = Router()

// POST /api/ai/career-recommendations
// Body: { yearsOfExperience, currentRole }
router.post('/career-recommendations', requireAuth, async (req, res) => {
  const { yearsOfExperience, currentRole } = req.body

  // Get user skills with names
  const { data: userSkills } = await supabase
    .from('user_skills')
    .select('skill_id, proficiency, skills(skill_name)')
    .eq('user_id', req.user.id)

  if (!userSkills || userSkills.length === 0) {
    return res.status(400).json({ message: 'No skills found. Please upload your resume or add skills first.' })
  }

  const flatSkills = userSkills.map(us => ({
    skill_name: us.skills?.skill_name,
    proficiency: us.proficiency
  })).filter(s => s.skill_name)

  const recommendations = await getIndiaCareerRecommendations(flatSkills, yearsOfExperience, currentRole)
  res.json({ recommendations })
})

// POST /api/ai/full-roadmap
// Body: { targetRole, yearsOfExperience }
router.post('/full-roadmap', requireAuth, async (req, res) => {
  const { targetRole, yearsOfExperience } = req.body
  if (!targetRole) return res.status(400).json({ message: 'targetRole is required' })

  // Get user skills
  const { data: userSkills } = await supabase
    .from('user_skills')
    .select('skill_id, skills(skill_name)')
    .eq('user_id', req.user.id)

  const flatSkills = (userSkills || []).map(us => ({
    skill_name: us.skills?.skill_name
  })).filter(s => s.skill_name)

  const roadmap = await generateFullRoadmap(targetRole, flatSkills, yearsOfExperience)
  if (!roadmap) return res.status(500).json({ message: 'Could not generate roadmap. Try again.' })

  res.json({ roadmap })
})

export default router
