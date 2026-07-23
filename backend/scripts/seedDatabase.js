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
  'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'node.js', 'express',
  'postgresql', 'mongodb', 'aws', 'docker', 'kubernetes', 'machine learning', 'figma', 
  'css', 'html', 'git', 'rest api', 'graphql', 'microservices', 'agile', 'sql',
  'react native', 'vue.js', 'spring boot', 'django', 'flask', 'pytest', 'jest',
  'ci/cd', 'linux', 'terraform', 'jenkins', 'prometheus', 'elasticsearch'
]

const JOBS = [
  {
    title: 'Senior React Developer',
    company: 'Flipkart',
    location: 'Bengaluru, Karnataka',
    salary_range: '₹25L - ₹35L',
    description: 'Build scalable React applications for Indias leading e-commerce platform.',
    required_skills: ['react', 'javascript', 'typescript', 'css']
  },
  {
    title: 'Backend Node.js Engineer',
    company: 'Swiggy',
    location: 'Gurgaon, Haryana',
    salary_range: '₹20L - ₹30L',
    description: 'Design and build robust backend services for food delivery infrastructure.',
    required_skills: ['node.js', 'javascript', 'postgresql', 'aws', 'docker']
  },
  {
    title: 'Full Stack Developer',
    company: 'Razorpay',
    location: 'Bengaluru, Karnataka',
    salary_range: '₹22L - ₹32L',
    description: 'Build payment solutions for millions of Indian businesses.',
    required_skills: ['react', 'node.js', 'javascript', 'postgresql']
  },
  {
    title: 'Data Scientist',
    company: 'PharmEasy',
    location: 'Mumbai, Maharashtra',
    salary_range: '₹18L - ₹28L',
    description: 'Drive AI/ML initiatives for healthcare transformation in India.',
    required_skills: ['python', 'machine learning']
  },
  {
    title: 'Frontend Developer - Angular',
    company: 'TCS',
    location: 'Pune, Maharashtra',
    salary_range: '₹15L - ₹25L',
    description: 'Develop enterprise-level applications using Angular framework.',
    required_skills: ['javascript', 'typescript', 'css', 'html']
  },
  {
    title: 'DevOps Engineer',
    company: 'Ola',
    location: 'Bengaluru, Karnataka',
    salary_range: '₹20L - ₹30L',
    description: 'Manage cloud infrastructure and deployment pipelines at scale.',
    required_skills: ['docker', 'aws', 'javascript', 'postgresql']
  },
  {
    title: 'Java Backend Developer',
    company: 'Infosys',
    location: 'Hyderabad, Telangana',
    salary_range: '₹16L - ₹26L',
    description: 'Build enterprise Java applications for global clients.',
    required_skills: ['java', 'postgresql', 'docker']
  },
  {
    title: 'Python Developer - AI/ML',
    company: 'Unacademy',
    location: 'Remote (India)',
    salary_range: '₹17L - ₹27L',
    description: 'Develop AI-powered personalized learning solutions.',
    required_skills: ['python', 'machine learning', 'javascript']
  },
  {
    title: 'React Native Developer',
    company: 'Byju\'s',
    location: 'Bangalore, Karnataka',
    salary_range: '₹18L - ₹28L',
    description: 'Build mobile apps reaching millions of Indian students.',
    required_skills: ['javascript', 'react', 'typescript']
  },
  {
    title: 'Full Stack Engineer - MERN',
    company: 'Vedantu',
    location: 'Bengaluru, Karnataka',
    salary_range: '₹19L - ₹29L',
    description: 'Create engaging online learning platforms for Indian students.',
    required_skills: ['react', 'node.js', 'javascript', 'postgresql', 'mongodb']
  },
  {
    title: 'Cloud Solutions Architect',
    company: 'NASSCOM',
    location: 'New Delhi, Delhi',
    salary_range: '₹25L - ₹40L',
    description: 'Design AWS solutions for enterprise clients across India.',
    required_skills: ['aws', 'docker', 'javascript', 'postgresql']
  },
  {
    title: 'QA Automation Engineer',
    company: 'HackerEarth',
    location: 'Remote (India)',
    salary_range: '₹13L - ₹22L',
    description: 'Automate testing for developer-focused platforms.',
    required_skills: ['javascript', 'typescript']
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
    { skill: 'react', title: 'React Complete Mastery - Scaler', duration: '3 weeks', url: 'https://www.scaler.com/topics/react/' },
    { skill: 'react', title: 'React by Code.org', duration: '4 weeks', url: 'https://react.dev/learn' },
    { skill: 'node.js', title: 'Node.js Bootcamp - Udemy India', duration: '2 weeks', url: 'https://nodejs.org/en/learn' },
    { skill: 'python', title: 'Python for Data Science - Coursera', duration: '5 weeks', url: 'https://www.coursera.org/learn/python-data-analysis' },
    { skill: 'postgresql', title: 'SQL & PostgreSQL - Udacity', duration: '3 weeks', url: 'https://www.postgresql.org/docs/' },
    { skill: 'aws', title: 'AWS Solutions Architect - Whizlabs', duration: '6 weeks', url: 'https://aws.amazon.com/training/' },
    { skill: 'docker', title: 'Docker & Kubernetes Essentials', duration: '4 weeks', url: 'https://www.docker.com/101-tutorial' },
    { skill: 'machine learning', title: 'ML with Python - Kaggle Learn', duration: '4 weeks', url: 'https://www.kaggle.com/learn/machine-learning' },
    { skill: 'typescript', title: 'TypeScript Masterclass - Scaler', duration: '2 weeks', url: 'https://www.typescriptlang.org/docs/handbook/' },
    { skill: 'angular', title: 'Angular Complete Guide - Udemy', duration: '5 weeks', url: 'https://angular.io/guide/architecture' }
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
