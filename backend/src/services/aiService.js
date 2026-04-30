import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const hasKey = () => !!process.env.GEMINI_API_KEY

async function callGemini(prompt) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  })
  return JSON.parse(response.text)
}

export async function extractSkillsFromText(text) {
  if (!hasKey()) {
    console.warn('GEMINI_API_KEY missing. Falling back to empty skills.')
    return []
  }
  try {
    const prompt = `Extract a list of technical skills from the following resume text. Return ONLY a JSON array of strings, where each string is a lowercase skill name (e.g., ["javascript", "react", "python", "sql", "aws"]). Do not include soft skills, only technical/hard skills, frameworks, languages, and tools.\n\nResume Text:\n${text.slice(0, 8000)}`
    const skills = await callGemini(prompt)
    return skills.map(name => ({ name: name.toLowerCase().trim(), source: 'ai' }))
  } catch (error) {
    console.error('AI Skill Extraction Error:', error.message)
    return []
  }
}

export async function generateRoadmap(missingSkills, jobTitle) {
  if (!hasKey() || !missingSkills.length) return []
  try {
    const missingNames = missingSkills.map(s => s.name).join(', ')
    const prompt = `A user is applying for a "${jobTitle}" position but is missing: ${missingNames}. Generate a highly actionable learning roadmap with exactly 3-4 steps. Return ONLY a JSON array where each object has: "title" (string), "estimatedTime" (string, e.g. "2 weeks"), "resourceUrl" (string, a real URL to freecodecamp, official docs, or coursera, or empty string).`
    return await callGemini(prompt)
  } catch (error) {
    console.error('AI Roadmap Error:', error.message)
    return []
  }
}

export async function getIndiaCareerRecommendations(userSkills, yearsOfExperience, currentRole) {
  if (!hasKey()) return []
  try {
    const skillNames = userSkills.map(s => s.skill_name || s.name).join(', ')
    const prompt = `You are an Indian tech career advisor. A candidate has the following skills: ${skillNames}. They have ${yearsOfExperience || 0} years of experience${currentRole ? ` and are currently a ${currentRole}` : ''}. Recommend exactly 5 job roles available in the Indian tech job market that best match their profile. For each role, provide: "role" (string, job title), "matchPercentage" (number 0-100 based on skills fit), "avgSalaryIndia" (string, e.g. "₹12-18 LPA"), "topCompanies" (array of 3 strings, e.g. ["TCS","Infosys","Wipro"]), "missingSkills" (array of strings, top 3 skills they need to learn), "description" (string, 1 sentence about the role). Return ONLY a JSON array of 5 objects.`
    return await callGemini(prompt)
  } catch (error) {
    console.error('AI Career Recommendation Error:', error.message)
    return []
  }
}

export async function generateFullRoadmap(targetRole, currentSkills, yearsOfExperience) {
  if (!hasKey()) return null
  try {
    const skillNames = currentSkills.map(s => s.skill_name || s.name).join(', ')
    const prompt = `You are a senior tech career coach. Create a comprehensive, multi-phase roadmap for someone targeting a "${targetRole}" role in the Indian job market. They currently know: ${skillNames}. They have ${yearsOfExperience || 0} years of experience. Return ONLY a JSON object with: "totalDuration" (string, e.g. "4-6 months"), "phases" (array of phase objects). Each phase object must have: "phase" (number), "title" (string), "duration" (string), "goal" (string, 1 sentence), "steps" (array of objects with "title" (string), "description" (string, 1-2 sentences), "resourceUrl" (string, real URL or empty), "estimatedTime" (string)). Create 3-4 phases covering fundamentals, intermediate skills, advanced topics, and job readiness.`
    return await callGemini(prompt)
  } catch (error) {
    console.error('AI Full Roadmap Error:', error.message)
    return null
  }
}
