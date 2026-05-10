import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
const NotFoundPage = () => (
  <div className="min-h-screen bg-dark-900 flex items-center justify-center text-center px-4">
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
      <div className="text-8xl mb-6">🅿️</div>
      <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-3">No Parking Here</h2>
      <p className="text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </motion.div>
  </div>
)
export default NotFoundPage
