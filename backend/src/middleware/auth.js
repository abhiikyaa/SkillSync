import { supabase } from '../lib/supabase.js'

export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1]
  if (!token) return res.status(401).json({ message: 'No token provided' })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return res.status(401).json({ message: 'Invalid or expired token' })

  req.user = user
  next()
}

export function requireRole(...roles) {
  return (req, res, next) => {
    const userRole = req.user?.user_metadata?.role
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: `Access denied. Requires role: ${roles.join(' or ')}` })
    }
    next()
  }
}
