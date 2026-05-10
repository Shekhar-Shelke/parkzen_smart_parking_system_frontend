import { motion } from 'framer-motion'
const AboutPage = () => (
  <div className="max-w-4xl mx-auto px-4 py-20">
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="text-center mb-16">
      <h1 className="text-5xl font-black text-white mb-4">About <span className="gradient-text">ParkZen</span></h1>
      <p className="text-gray-400 text-xl max-w-2xl mx-auto">We're on a mission to eliminate the stress of urban parking through smart technology.</p>
    </motion.div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { title:'Our Mission', text:'Make parking effortless for every urban driver by connecting them to real-time, smart parking infrastructure.' },
        { title:'Our Vision', text:'A world where finding a parking spot takes seconds, not minutes — with zero frustration.' },
        { title:'For Drivers', text:'Discover nearby parking, check real-time availability, book instantly, and pay securely through our platform.' },
        { title:'For Owners', text:'Monetize your parking space, manage bookings, track earnings, and grow your parking business effortlessly.' },
      ].map((item, i) => (
        <motion.div key={item.title} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.1 }} className="card">
          <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
          <p className="text-gray-400 leading-relaxed">{item.text}</p>
        </motion.div>
      ))}
    </div>
  </div>
)
export default AboutPage
