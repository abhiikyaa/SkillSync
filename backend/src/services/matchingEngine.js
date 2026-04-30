import { calculateSkillGap } from './skillGapEngine.js'

/**
 * Ranks all active jobs for a user based on skill match score
 * Returns top 20 jobs sorted by match score descending
 */
export function getJobRecommendations(userSkills, jobs) {
  const ranked = jobs.map(job => {
    const { matchScore } = calculateSkillGap(userSkills, job.job_skills || [])
    const skillNames = job.job_skills?.map(js => js.skills?.skill_name).filter(Boolean) || []
    return {
      id:          job.id,
      title:       job.title,
      company:     job.company || 'Company',
      location:    job.location,
      salaryRange: job.salary_range,
      matchScore,
      skills:      skillNames,
      applied:     false,
    }
  })

  return ranked
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 20)
}
