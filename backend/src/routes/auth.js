import { Router } from 'express'
import { supabase } from '../lib/supabase.js'

const router = Router()

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, name, role } = req.body
  if (!email || !password || !name || !role) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email, password,
    user_metadata: { name, role },
    email_confirm: true   // auto-confirm for dev; set false in production
  })

  if (error) return res.status(400).json({ message: error.message })

  // Create profile row
  await supabase.from('profiles').insert({
    id:    data.user.id,
    name,
    email,
    role
  })

  res.status(201).json({ message: 'Account created', userId: data.user.id })
})

// POST /api/auth/logout  (client handles Supabase signout; this just clears server-side if needed)
router.post('/logout', (_req, res) => res.json({ message: 'Logged out' }))

export default router
