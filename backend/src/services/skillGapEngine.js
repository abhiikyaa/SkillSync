/**
 * Skill Gap Engine
 * Match Score = (Weighted Skill Match × 60%) + (Experience Match × 20%) + (Career Goal Alignment × 20%)
 * For MVP: we calculate the Weighted Skill Match portion
 */

const PROFICIENCY_SCORE = { 1: 25, 2: 50, 3: 75, 4: 100 }   // 1=Beginner ... 4=Expert

export function calculateSkillGap(userSkills, jobSkills) {
  const userSkillMap = new Map(
    userSkills.map(us => [us.skill_id, us])
  )

  let totalWeight    = 0
  let earnedScore    = 0
  const matchedSkills  = []
  const missingSkills  = []

  for (const js of jobSkills) {
    const weight = js.weight || 1
    totalWeight += weight

    const userSkill = userSkillMap.get(js.skill_id)
    if (userSkill) {
      const profScore = PROFICIENCY_SCORE[userSkill.proficiency] || 25
      earnedScore += (profScore / 100) * weight
      matchedSkills.push({
        skillId:    js.skill_id,
        name:       js.skills?.skill_name,
        proficiency: getProficiencyLabel(userSkill.proficiency),
        weight
      })
    } else {
      missingSkills.push({
        skillId:  js.skill_id,
        name:     js.skills?.skill_name,
        priority: js.priority || 'medium',
        weight
      })
    }
  }

  // Weighted skill match (0-100)
  const skillMatchPercent = totalWeight > 0 ? (earnedScore / totalWeight) * 100 : 0

  // Final match score — applying 60% weight for skill match (20%+20% for experience/goals added later)
  const matchScore = Math.round(skillMatchPercent * 0.6 + 20 + 20)  // 20+20 = baseline for non-implemented components

  // Sort missing by weight desc (most important first)
  missingSkills.sort((a, b) => b.weight - a.weight)

  return {
    matchScore: Math.min(matchScore, 100),
    matchedSkills,
    missingSkills
  }
}

function getProficiencyLabel(level) {
  const map = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced', 4: 'Expert' }
  return map[level] || 'Beginner'
}
