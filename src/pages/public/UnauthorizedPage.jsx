import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
const UnauthorizedPage = () => (
  <div className="min-h-screen bg-dark-900 flex items-center justify-center text-center px-4">
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
      <div className="text-8xl mb-6">🚫</div>
      <h1 className="text-4xl font-black text-red-400 mb-3">Access Denied</h1>
      <p className="text-gray-400 mb-8">You don't have permission to access this page.</p>
      <Link to="/" className="btn-primary">Go Home</Link>
    </motion.div>
  </div>
)
export default UnauthorizedPage
