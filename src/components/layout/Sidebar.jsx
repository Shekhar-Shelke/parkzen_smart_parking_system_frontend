import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { FiLogOut } from 'react-icons/fi'

const Sidebar = ({ links, title }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }
  return (
    <aside className="w-64 h-screen sticky top-0 glass-dark border-r border-white/10 flex flex-col">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
          <div>
            <div className="text-white font-bold text-sm">ParkZen</div>
            <div className="text-gray-500 text-xs">{title}</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="text-lg">{icon}</span>
            <span className="text-sm">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <FiLogOut className="text-lg" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  )
}
export default Sidebar
