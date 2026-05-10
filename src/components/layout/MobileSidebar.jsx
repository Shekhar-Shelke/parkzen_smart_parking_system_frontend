import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const MobileSidebar = ({ links, title }) => {
  const [open, setOpen] = useState(false)
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }
  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-white/10 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-accent-500 rounded-md flex items-center justify-center text-white font-bold text-xs">P</div>
          <span className="text-white font-bold text-sm">ParkZen</span>
        </div>
        <button onClick={() => setOpen(true)} className="text-gray-400 hover:text-white p-1"><FiMenu size={22} /></button>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 bg-black/60 z-50" onClick={() => setOpen(false)} />
            <motion.div initial={{ x:-280 }} animate={{ x:0 }} exit={{ x:-280 }}
              className="fixed left-0 top-0 h-full w-64 z-50 glass-dark border-r border-white/10 flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="text-white font-bold">{title}</span>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white"><FiX /></button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {links.map(({ to, icon, label }) => (
                  <NavLink key={to} to={to} onClick={() => setOpen(false)}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm">{label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="p-4 border-t border-white/10">
                <div className="text-xs text-gray-500 mb-3">{user?.email}</div>
                <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:bg-red-500/10">
                  <FiLogOut /><span className="text-sm">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
export default MobileSidebar
