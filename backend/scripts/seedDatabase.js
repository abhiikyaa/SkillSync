import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY // Must use service role key for seeding

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Service Key in .env")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'react', 'node.js', 
  'postgresql', 'aws', 'docker', 'machine learning', 'figma', 'css', 'html'
]

const JOBS = [
  {
    title: 'Senior React Developer',
    company: 'TechFlow Solutions',
    location: 'Remote',
    salary_range: '$120k - $150k',
    description: 'Looking for a senior React developer to lead our frontend team.',
    required_skills: ['react', 'javascript', 'typescript', 'css']
  },
  {
    title: 'Backend Node.js Engineer',
    company: 'DataScale Inc',
    location: 'New York, NY',
    salary_range: '$130k - $160k',
    description: 'Build scalable backend services using Node.js and Postgres.',
    required_skills: ['node.js', 'javascript', 'postgresql', 'aws', 'docker']
  },
  {
    title: 'Full Stack Developer',
    company: 'StartupX',
    location: 'San Francisco, CA',
    salary_range: '$110k - $140k',
    description: 'Fast-paced startup looking for a full stack dev.',
    required_skills: ['react', 'node.js', 'javascript', 'postgresql']
  }
]

async function seed() {
  console.log("Seeding database...")

  // 1. Insert Skills
  console.log("Inserting skills...")
  const skillInserts = SKILLS.map(s => ({ skill_name: s }))
  const { data: insertedSkills, error: skillErr } = await supabase
    .from('skills')
    .upsert(skillInserts, { onConflict: 'skill_name' })
    .select()

  if (skillErr) {
    console.error("Error inserting skills:", skillErr.message)
    return
  }

  const skillMap = new Map(insertedSkills.map(s => [s.skill_name, s.id]))

  // 2. Insert Jobs
  console.log("Inserting jobs...")
  for (const jobDef of JOBS) {
    const { title, company, location, salary_range, description, required_skills } = jobDef
    
    // Check if job exists
    const { data: existingJob } = await supabase.from('jobs').select('id').eq('title', title).eq('company', company).single()
    
    let jobId
    if (existingJob) {
      jobId = existingJob.id
    } else {
      const { data: newJob, error: jobErr } = await supabase
        .from('jobs')
        .insert({
          title, company, location, salary_range, description, is_active: true
        })
        .select()
        .single()
        
      if (jobErr) {
        console.error(`Error inserting job ${title}:`, jobErr.message)
        continue
      }
      jobId = newJob.id
    }

    // 3. Insert Job Skills
    console.log(`Inserting skills for job: ${title}`)
    const jobSkillInserts = required_skills.map(sName => {
      const skillId = skillMap.get(sName)
      if (!skillId) return null
      return {
        job_id: jobId,
        skill_id: skillId,
        weight: 1,
        priority: 'high'
      }
    }).filter(Boolean)

    if (jobSkillInserts.length > 0) {
      await supabase.from('job_skills').upsert(jobSkillInserts, { onConflict: 'job_id,skill_id' })
    }
  }

  // 4. Insert some mock learning paths
  console.log("Inserting learning paths...")
  const paths = [
    { skill: 'react', title: 'React for Beginners', duration: '2 weeks', url: 'https://react.dev/learn' },
    { skill: 'node.js', title: 'Node.js Crash Course', duration: '1 week', url: 'https://nodejs.org/en/learn' },
    { skill: 'postgresql', title: 'SQL Mastery', duration: '3 weeks', url: 'https://www.postgresql.org/docs/' }
  ]

  for (const p of paths) {
    const skillId = skillMap.get(p.skill)
    if (!skillId) continue
    
    try {
      await supabase.from('learning_paths').upsert({
        skill_id: skillId,
        title: p.title,
        duration: p.duration,
        url: p.url,
        description: 'A great course to learn ' + p.skill
      }, { onConflict: 'skill_id,url' })
    } catch (e) {
      // Ignore unique constraint errors if schema differs
    }
  }

  console.log("Database seeded successfully!")
}

seed()
