// backend/src/services/aiService.js
import { GoogleGenerativeAI } from '@google/generative-ai'

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const hasKey = () => !!process.env.GEMINI_API_KEY

// ─────────────────────────────────────────────
// Core helper — calls Gemini and parses JSON
// ─────────────────────────────────────────────
async function callGemini(prompt, systemPrompt = '', maxTokens = 1500) {
  try {
    const model = client.getGenerativeModel({ 
      model: 'gemini-1.5-flash'
    })
    
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
    
    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: { maxOutputTokens: maxTokens }
    })
    
    const text = response.response.text().trim()
    const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
    return JSON.parse(clean)
  } catch (error) {
    console.error('Gemini API Error:', error.message)
    if (error.status === 429 || error.message?.includes('quota')) {
      throw new Error('AI service rate limit exceeded. Please try again in a moment.')
    }
    throw error
  }
}

// ─────────────────────────────────────────────
// 1. Extract skills from resume text
// ─────────────────────────────────────────────
export async function extractSkillsFromText(text) {
  if (!hasKey()) {
    console.warn('GEMINI_API_KEY missing. Falling back to empty skills.')
    return []
  }
  try {
    const system = `You are a precise resume parser. You ONLY output valid JSON arrays. No explanation, no markdown, no preamble.`
    const prompt = `Extract all technical skills from this resume text. Return ONLY a JSON array of lowercase skill name strings.
Include: programming languages, frameworks, libraries, databases, cloud platforms, DevOps tools, testing tools.
Exclude: soft skills, communication, teamwork.

Example output: ["javascript", "react", "node.js", "postgresql", "aws", "docker"]

Resume Text:
${text.slice(0, 8000)}`

    const skills = await callGemini(prompt, system, 800)
    if (!Array.isArray(skills)) return []
    return skills.map(name => ({ name: String(name).toLowerCase().trim(), source: 'ai' }))
  } catch (error) {
    console.error('AI Skill Extraction Error:', error.message)
    return []
  }
}

// ─────────────────────────────────────────────
// 2. Generate a short skill-gap roadmap
// ─────────────────────────────────────────────
export async function generateRoadmap(missingSkills, jobTitle) {
  if (!hasKey() || !missingSkills.length) return []
  try {
    const missingNames = missingSkills.map(s => s.name).join(', ')
    const system = `You are a senior tech career coach. You ONLY output valid JSON arrays. No explanation, no markdown, no preamble.`
    const prompt = `A developer is applying for a "${jobTitle}" role and is missing these skills: ${missingNames}.

Create exactly 3-4 actionable learning steps. Return ONLY a JSON array where each object has:
- "title": short step name (string)
- "estimatedTime": realistic time (e.g. "2 weeks")
- "resourceUrl": a real, working URL (freecodecamp.org, official docs, coursera.org — or empty string if unsure)
- "description": 1-2 sentence explanation

Output ONLY the JSON array.`

    return await callGemini(prompt, system, 1000)
  } catch (error) {
    console.error('AI Roadmap Error:', error.message)
    return []
  }
}

// ─────────────────────────────────────────────
// 3. India-specific career recommendations
// ─────────────────────────────────────────────
export async function getIndiaCareerRecommendations(userSkills, yearsOfExperience, currentRole) {
  if (!hasKey()) return []
  try {
    const skillNames = userSkills.map(s => s.skill_name || s.name).filter(Boolean).join(', ')
    if (!skillNames) return []

    const exp = yearsOfExperience || 0
    const role = currentRole || 'fresher'
    const level = exp === 0 ? 'fresher/entry-level' : exp <= 2 ? 'junior' : exp <= 5 ? 'mid-level' : 'senior'

    const system = `You are an expert Indian tech job market advisor with deep knowledge of hiring trends at Indian product companies, MNCs, and startups as of 2024-2025. You ONLY output valid JSON arrays. No explanation, no markdown, no preamble.`

    const prompt = `Candidate profile:
- Skills: ${skillNames}
- Experience: ${exp} years (${level})
- Current/last role: ${role}

Recommend exactly 5 real job roles actively hiring in the Indian tech market that match this profile.

Return ONLY a JSON array of exactly 5 objects. Each object MUST have:
- "role": exact job title (string)
- "matchPercentage": integer 0-100, realistic score based on skills overlap
- "avgSalaryIndia": realistic salary band in LPA (e.g. "₹8-12 LPA" for juniors, "₹18-28 LPA" for seniors)
- "topCompanies": array of exactly 3 real Indian/MNC companies actively hiring for this role (e.g. ["Flipkart", "Razorpay", "Freshworks"])
- "missingSkills": array of exactly 3 skill strings the candidate should learn for this role
- "description": 1 sentence describing what this role involves in Indian companies

IMPORTANT: Base salary ranges on actual 2024 Indian market rates. Be realistic — do not inflate numbers.`

    const result = await callGemini(prompt, system, 1500)
    if (!Array.isArray(result) || result.length === 0) {
      console.warn('Career recommendations returned empty or non-array.')
      return []
    }
    return result
  } catch (error) {
    console.error('AI Career Recommendation Error:', error.message)
    return []
  }
}

// ─────────────────────────────────────────────
// 4. Full multi-phase learning roadmap
// ─────────────────────────────────────────────
export async function generateFullRoadmap(targetRole, currentSkills, yearsOfExperience) {
  if (!hasKey()) return null
  try {
    const skillNames = currentSkills.map(s => s.skill_name || s.name).filter(Boolean).join(', ')
    const exp = yearsOfExperience || 0

    const system = `You are a senior tech career coach specialising in the Indian job market. You ONLY output valid JSON objects. No explanation, no markdown, no preamble.`

    const prompt = `Create a comprehensive roadmap for someone targeting: "${targetRole}"
Current skills: ${skillNames || 'none listed'}
Experience: ${exp} years

Return ONLY a JSON object with exactly these fields:
- "totalDuration": realistic total time (e.g. "3-5 months")
- "phases": array of 3-4 phase objects

Each phase object must have:
- "phase": phase number (integer)
- "title": phase name (string)
- "duration": time for this phase (string)
- "goal": 1-sentence phase objective (string)
- "steps": array of 3-5 step objects, each with:
  - "title": step name (string)
  - "description": 1-2 sentence explanation (string)
  - "resourceUrl": real working URL or empty string
  - "estimatedTime": time for this step (string)

Cover: fundamentals gaps → core skills → advanced topics → job readiness (interview prep, projects, portfolio).`

    return await callGemini(prompt, system, 2000)
  } catch (error) {
    console.error('AI Full Roadmap Error:', error.message)
    return null
  }
}

// ─────────────────────────────────────────────
// 5. AI Career Chat — multi-turn conversation
// ─────────────────────────────────────────────
export async function chatWithAdvisor(conversationHistory = [], userMessage, userContext = {}) {
  if (!hasKey()) throw new Error('GEMINI_API_KEY is not set.')

  try {
    const { skills = [], yearsOfExperience = 0, currentRole = '', targetRole = '' } = userContext
    const skillNames = skills.map(s => s.skill_name || s.name).filter(Boolean).join(', ')

    const systemPrompt = `You are SkillSync AI, an expert Indian tech career advisor and mentor built into the SkillSync platform.

Your role:
- Answer career questions, technical doubts, interview tips, and job search strategy
- Give highly specific, actionable advice tailored to the Indian tech job market (Bangalore, Hyderabad, Pune, Mumbai, Delhi NCR)
- Reference real companies, realistic salary ranges, actual interview patterns at Indian companies
- Be concise but thorough — avoid generic advice

User's profile (use this for context):
- Skills: ${skillNames || 'not specified'}
- Experience: ${yearsOfExperience} years
- Current role: ${currentRole || 'not specified'}
- Target role: ${targetRole || 'not specified'}

Tone: friendly, direct, like a senior colleague who genuinely wants to help. Use simple language. Avoid corporate fluff.
If asked about DSA, system design, or interview prep — give concrete, India-specific advice (e.g. Flipkart/Amazon interview patterns).`

    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Build conversation history for Gemini format
    let contents = []

    if (conversationHistory.length === 0) {
      // First message — embed system prompt
      contents = [
        { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userMessage }] }
      ]
    } else {
      // Build full history — system prompt goes in first user message
      const firstUserMsg = conversationHistory[0]
      contents.push({
        role: 'user',
        parts: [{ text: systemPrompt + '\n\n' + firstUserMsg.content }]
      })

      // Add remaining history (skip first since we already added it)
      for (let i = 1; i < conversationHistory.length; i++) {
        const msg = conversationHistory[i]
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        })
      }

      // Add current user message
      contents.push({ role: 'user', parts: [{ text: userMessage }] })
    }

    const response = await model.generateContent({
      contents,
      generationConfig: { maxOutputTokens: 1024 }
    })

    return response.response.text()
  } catch (error) {
    console.error('Chat error:', error.message)
    if (error.status === 429 || error.message?.includes('quota')) {
      throw new Error('Rate limit reached. Please wait a moment and try again.')
    }
    throw error
  }
}