import express from 'express'
import { chatWithAdvisor } from '../services/aiService.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

/**
 * POST /api/chat
 * Body: {
 *   message: string,
 *   history: Array<{role: 'user'|'assistant', content: string}>,
 *   context?: { skills, yearsOfExperience, currentRole, targetRole }
 * }
 */
router.post('/', requireAuth, async (req, res) => {
  const { message, history = [], context = {} } = req.body

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' })
  }

  // Limit history to last 20 turns to avoid token bloat
  const trimmedHistory = history.slice(-20)

  try {
    const reply = await chatWithAdvisor(trimmedHistory, message.trim(), context)
    res.json({ reply })
  } catch (error) {
    console.error('Chat error:', error.message)
    
    // Check if it's a quota error
    if (error.message?.includes('rate limit') || error.message?.includes('quota')) {
      return res.status(429).json({ 
        error: 'Free tier rate limit reached. Please wait a moment before trying again. For unlimited access, upgrade your Gemini API plan.' 
      })
    }
    
    res.status(500).json({ error: 'AI service unavailable. Try again shortly.' })
  }
})

export default router