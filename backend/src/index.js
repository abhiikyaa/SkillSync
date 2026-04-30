import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

import authRoutes  from './routes/auth.js'
import userRoutes  from './routes/users.js'
import skillRoutes from './routes/skills.js'
import jobRoutes   from './routes/jobs.js'
import aiRoutes    from './routes/ai.js'

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ───────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Rate limiting — 100 requests per 15 minutes per IP
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests, please slow down.' }))

// ── Routes ───────────────────────────────────────────────────────
app.use('/api/auth',   authRoutes)
app.use('/api/users',  userRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/jobs',   jobRoutes)
app.use('/api/ai',     aiRoutes)

// ── Health check ─────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// ── Global error handler ─────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

app.listen(PORT, () => console.log(`SkillSync backend running on http://localhost:${PORT}`))
