import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiSearch, FiMapPin, FiZap, FiShield, FiClock, FiStar } from 'react-icons/fi'

const features = [
  { icon:<FiSearch size={24}/>, title:'Smart Search', desc:'Find the nearest parking spots in real-time using GPS.' },
  { icon:<FiZap size={24}/>, title:'EV Charging', desc:'Book slots with electric vehicle charging stations.' },
  { icon:<FiShield size={24}/>, title:'Secure Payments', desc:'Safe Razorpay-powered payments with instant confirmation.' },
  { icon:<FiClock size={24}/>, title:'Easy Extension', desc:'Extend your parking time from anywhere, anytime.' },
  { icon:<FiMapPin size={24}/>, title:'Live Availability', desc:'Real-time slot availability with map view.' },
  { icon:<FiStar size={24}/>, title:'Rate & Review', desc:'Share feedback to help the community find the best spots.' }
]

const testimonials = [
  { name:'Priya Sharma', role:'Daily Commuter', text:'ParkZen saved me 30 minutes every morning. The booking is seamless!', rating:5 },
  { name:'Rahul Mehta', role:'Business Owner', text:'As an EV user, finding charging spots was a nightmare. Not anymore!', rating:5 },
  { name:'Anjali Singh', role:'Weekend Driver', text:'Clean UI, fast payments, and my slot is always ready. Love it!', rating:5 },
]

const HomePage = () => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/login')
  }

  return (
    <div className="bg-dark-900 overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-600/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay:'1s'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
        </div>
        <div className="max-w-4xl mx-auto text-center z-10">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
            <span className="inline-block glass px-4 py-2 rounded-full text-sm text-primary-400 font-medium mb-6 border border-primary-500/30">
              🚗 Smart Parking Revolution
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Park Smarter.<br />
              <span className="gradient-text">Drive Better.</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Find, book and pay for parking in seconds. Real-time availability, EV charging spots, and zero hassle.
            </p>
            <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="input-field pl-10 py-4 text-base"
                  placeholder="Enter location..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary px-8 py-4 text-base">Find</button>
            </form>
          </motion.div>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[['10K+','Parking Spots'],['50K+','Happy Users'],['99%','Uptime']].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-bold gradient-text">{v}</div>
                <div className="text-sm text-gray-500 mt-1">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Modern parking management with cutting-edge features designed for the urban driver.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once:true }}
                className="card hover:border-primary-500/30 hover:shadow-glow-blue transition-all duration-300 group">
                <div className="text-primary-400 mb-4 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-dark-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Our Users Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                transition={{ delay: i * 0.15 }} viewport={{ once:true }} className="card">
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, j) => <FiStar key={j} className="text-yellow-400 fill-current" />)}
                </div>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="glass rounded-3xl p-12 border border-primary-500/20 shadow-glow-blue">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Park Smarter?</h2>
            <p className="text-gray-400 mb-8">Join thousands of drivers who have already made the switch.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/register" className="btn-primary px-8 py-4">Get Started Free</Link>
              <Link to="/owner/register" className="btn-secondary px-8 py-4">List Your Parking</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
export default HomePage
