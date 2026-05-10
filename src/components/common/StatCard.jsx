import { motion } from 'framer-motion'

const StatCard = ({ title, value, icon, color='blue', change, index=0 }) => {
  const colors = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400',
    green: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20 text-yellow-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/20 text-red-400',
    pink: 'from-pink-500/20 to-pink-600/10 border-pink-500/20 text-pink-400',
  }
  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-5 shadow-card`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-400">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {change !== undefined && (
        <div className={`text-xs mt-1 ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {change >= 0 ? '▲' : '▼'} {Math.abs(change)}% from last month
        </div>
      )}
    </motion.div>
  )
}
export default StatCard
