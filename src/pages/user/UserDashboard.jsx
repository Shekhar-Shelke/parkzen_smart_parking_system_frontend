import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getBookingHistory } from '../../api/userApi'
import { useAuth } from '../../context/AuthContext'
import PageWrapper from '../../components/common/PageWrapper'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import { formatCurrency, formatDateTime } from '../../utils/helpers'
import Loader from '../../components/common/Loader'

const UserDashboard = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBookingHistory().then(r => setBookings(r.data.data || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const stats = {
    total: bookings.length,
    active: bookings.filter(b => ['CONFIRMED','ACTIVE'].includes(b.bookingStatus)).length,
    completed: bookings.filter(b => b.bookingStatus === 'COMPLETED').length,
    spent: bookings.filter(b => b.bookingStatus !== 'CANCELLED').reduce((s, b) => s + (b.totalAmount || 0), 0)
  }

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋</h1>
        <p className="text-gray-400 mt-1">Here's your parking overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Bookings" value={stats.total} icon="📋" color="blue" index={0} />
        <StatCard title="Active" value={stats.active} icon="✅" color="green" index={1} />
        <StatCard title="Completed" value={stats.completed} icon="🏁" color="purple" index={2} />
        <StatCard title="Total Spent" value={formatCurrency(stats.spent)} icon="💳" color="yellow" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {[
          { to:'/user/parkings', icon:'🅿️', label:'Find Parking', desc:'Search nearby spots', color:'from-blue-500/20 to-blue-600/10 border-blue-500/20' },
          { to:'/user/bookings', icon:'📋', label:'My Bookings', desc:'View all bookings', color:'from-purple-500/20 to-purple-600/10 border-purple-500/20' },
          { to:'/user/feedback', icon:'⭐', label:'Give Feedback', desc:'Rate your experience', color:'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20' },
        ].map((item, i) => (
          <motion.div key={item.to} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.1 }}>
            <Link to={item.to} className={`block bg-gradient-to-br ${item.color} border rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-card`}>
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="font-semibold text-white">{item.label}</div>
              <div className="text-sm text-gray-400 mt-1">{item.desc}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Bookings</h2>
        {loading ? <div className="flex justify-center py-8"><Loader /></div> :
          bookings.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">🅿️</div>
              <p className="text-gray-400">No bookings yet. <Link to="/user/parkings" className="text-primary-400 hover:underline">Find parking</Link></p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map(b => (
                <div key={b.id} className="flex items-center justify-between p-4 bg-dark-700/50 rounded-xl border border-white/5">
                  <div>
                    <div className="font-medium text-white text-sm">{b.parkingAreaName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{formatDateTime(b.startTime)} • Slot {b.slotNumber}</div>
                  </div>
                  <div className="text-right">
                    <Badge status={b.bookingStatus} />
                    <div className="text-sm font-semibold text-white mt-1">{formatCurrency(b.totalAmount)}</div>
                  </div>
                </div>
              ))}
              {bookings.length > 5 && (
                <Link to="/user/bookings" className="block text-center text-primary-400 hover:text-primary-300 text-sm py-2">View all bookings →</Link>
              )}
            </div>
          )}
      </div>
    </PageWrapper>
  )
}
export default UserDashboard
