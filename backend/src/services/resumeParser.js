import pdfParse from 'pdf-parse'
import { extractSkillsFromText } from './aiService.js'

/**
 * Extracts skills from a resume buffer (PDF).
 * Returns array of { name, matched: true }
 */
export async function extractSkillsFromResume(fileBuffer) {
  try {
    const { text } = await pdfParse(fileBuffer)
    
    // Call Gemini API to extract skills dynamically
    const extractedSkills = await extractSkillsFromText(text)
    
    return extractedSkills
  } catch (err) {
    console.error('Resume parse error:', err.message)
    return []
  }
}
