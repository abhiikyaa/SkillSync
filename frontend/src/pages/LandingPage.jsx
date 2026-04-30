import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, Target, Layout, MoveRight, CheckCircle2, UploadCloud, Map as MapIcon, BarChart3 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-outcrowd-black text-white font-sans selection:bg-outcrowd-accent selection:text-white pb-20">
      
      {/* Floating Glassmorphism Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50">
        <div className="bg-outcrowd-dark/60 backdrop-blur-md border border-white/10 rounded-full px-6 py-4 flex items-center justify-between shadow-2xl">
          <div className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-outcrowd-accent flex items-center justify-center">
              <span className="text-outcrowd-black text-lg">S</span>
            </div>
            SkillSync
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link to="/register" className="bg-white text-outcrowd-black text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-outcrowd-purple/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-outcrowd-accent/20 blur-[100px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium text-gray-300 mb-8">
            ✨ Your career, elevated.
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1] mb-8">
            Sync your skills with <span className="text-outcrowd-accent">tomorrow's</span> opportunities.
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover skill gaps, get personalized learning roadmaps, and land your dream job with AI-powered insights.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link to="/register" className="group relative inline-flex items-center justify-center px-8 py-4 bg-outcrowd-accent text-white rounded-full font-semibold text-lg overflow-hidden transition-transform hover:scale-105">
              <span className="relative z-10 flex items-center gap-2">
                Start your journey <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Feature Card 1 */}
          <div className="bg-outcrowd-dark rounded-[2rem] p-8 border border-white/5 hover:border-outcrowd-accent/50 transition-colors group">
            <div className="w-14 h-14 bg-outcrowd-black rounded-full flex items-center justify-center mb-8 border border-white/10 group-hover:bg-outcrowd-accent/10 transition-colors">
              <Zap className="text-outcrowd-accent w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Skill Gap Analysis</h3>
            <p className="text-outcrowd-gray leading-relaxed">
              Upload your resume and instantly see what you're missing for the roles you want.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-outcrowd-dark rounded-[2rem] p-8 border border-white/5 hover:border-outcrowd-purple/50 transition-colors md:-translate-y-8 group">
            <div className="w-14 h-14 bg-outcrowd-black rounded-full flex items-center justify-center mb-8 border border-white/10 group-hover:bg-outcrowd-purple/10 transition-colors">
              <Target className="text-outcrowd-purple w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Personalized Roadmaps</h3>
            <p className="text-outcrowd-gray leading-relaxed">
              Get step-by-step guides and resource recommendations to level up your career.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-outcrowd-dark rounded-[2rem] p-8 border border-white/5 hover:border-blue-500/50 transition-colors group">
            <div className="w-14 h-14 bg-outcrowd-black rounded-full flex items-center justify-center mb-8 border border-white/10 group-hover:bg-blue-500/10 transition-colors">
              <Layout className="text-blue-500 w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Smart Job Matches</h3>
            <p className="text-outcrowd-gray leading-relaxed">
              Connect directly with recruiters looking for the exact skills you possess.
            </p>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 relative z-10 bg-outcrowd-dark/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How it works</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">From resume to dream job in three simple steps.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (hidden on mobile) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-outcrowd-accent/0 via-outcrowd-purple/50 to-outcrowd-accent/0" />
            
            <div className="relative text-center">
              <div className="w-24 h-24 mx-auto bg-outcrowd-black border-2 border-white/10 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-xl shadow-outcrowd-accent/10">
                <UploadCloud className="text-white w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">1. Upload Resume</h3>
              <p className="text-gray-400">Our AI instantly parses your experience and identifies your current skill set.</p>
            </div>
            
            <div className="relative text-center">
              <div className="w-24 h-24 mx-auto bg-outcrowd-black border-2 border-white/10 rounded-full flex items-center justify-center mb-6 relative z-10 shadow-xl shadow-outcrowd-purple/10">
                <BarChart3 className="text-white w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">2. Analyze Gaps</h3>
              <p className="text-gray-400">Compare your profile against thousands of open roles to find exactly what's missing.</p>
            </div>
            
            <div className="relative text-center">
              <div className="w-24 h-24 mx-auto bg-outcrowd-black border-2 border-outcrowd-accent rounded-full flex items-center justify-center mb-6 relative z-10 shadow-xl shadow-outcrowd-accent/20">
                <MapIcon className="text-outcrowd-accent w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">3. Level Up</h3>
              <p className="text-gray-400">Follow personalized learning paths and apply directly to matching jobs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact/Statistics Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Stop guessing.<br />Start <span className="text-outcrowd-purple">growing.</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              SkillSync removes the mystery from career advancement by giving you hard data on exactly what recruiters are looking for today.
            </p>
            <ul className="space-y-4">
              {[
                'Real-time market skill demands',
                'Curated, high-quality learning resources',
                'Direct pipeline to hiring managers'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-lg font-medium text-gray-300">
                  <CheckCircle2 className="text-outcrowd-accent w-6 h-6 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-outcrowd-dark p-8 rounded-[2rem] border border-white/5 text-center flex flex-col justify-center aspect-square">
              <p className="text-5xl font-bold text-white mb-2">95%</p>
              <p className="text-gray-400 font-medium">Match Accuracy</p>
            </div>
            <div className="bg-outcrowd-accent p-8 rounded-[2rem] text-center flex flex-col justify-center aspect-square translate-y-8">
              <p className="text-5xl font-bold text-white mb-2">50k+</p>
              <p className="text-white/80 font-medium">Skills Analyzed</p>
            </div>
            <div className="bg-outcrowd-purple p-8 rounded-[2rem] text-center flex flex-col justify-center aspect-square">
              <p className="text-5xl font-bold text-white mb-2">10k+</p>
              <p className="text-white/80 font-medium">Open Roles</p>
            </div>
            <div className="bg-outcrowd-dark p-8 rounded-[2rem] border border-white/5 text-center flex flex-col justify-center aspect-square translate-y-8">
              <p className="text-5xl font-bold text-white mb-2">24/7</p>
              <p className="text-gray-400 font-medium">AI Career Coach</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-t from-outcrowd-dark to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold tracking-tight mb-8">Ready to sync?</h2>
          <p className="text-xl text-gray-400 mb-10">Join thousands of professionals bridging the gap.</p>
          <Link to="/register" className="inline-block px-8 py-4 bg-white text-outcrowd-black rounded-full font-bold text-lg hover:bg-gray-200 transition-colors">
            Create Free Account
          </Link>
        </div>
      </section>

    </div>
  )
}
