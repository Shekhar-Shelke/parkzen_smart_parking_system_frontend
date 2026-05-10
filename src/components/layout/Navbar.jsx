import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { isAuthenticated, user, logout, role } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }
  const getDashboardLink = () => {
    if (role === 'ROLE_USER') return '/user/dashboard'
    if (role === 'ROLE_OWNER') return '/owner/dashboard'
    if (role === 'ROLE_ADMIN') return '/admin/dashboard'
    return '/'
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
            <span className="text-xl font-bold gradient-text">ParkZen</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to={getDashboardLink()} className="btn-secondary text-sm py-2">Dashboard</Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm">
                  <FiLogOut /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-secondary text-sm py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Sign Up</Link>
              </div>
            )}
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden text-gray-400 hover:text-white">
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
            className="md:hidden glass border-t border-white/10 px-4 py-4 flex flex-col gap-3">
            <Link to="/about" className="text-gray-400 hover:text-white py-2" onClick={() => setOpen(false)}>About</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white py-2" onClick={() => setOpen(false)}>Contact</Link>
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="btn-secondary text-sm text-center" onClick={() => setOpen(false)}>Dashboard</Link>
                <button onClick={() => { handleLogout(); setOpen(false) }} className="btn-danger text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm text-center" onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className="btn-primary text-sm text-center" onClick={() => setOpen(false)}>Sign Up</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
export default Navbar
