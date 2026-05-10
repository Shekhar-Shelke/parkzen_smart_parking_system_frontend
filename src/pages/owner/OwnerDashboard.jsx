import { useEffect, useState } from 'react'
import { getOwnerDashboard } from '../../api/ownerApi'
import PageWrapper from '../../components/common/PageWrapper'
import StatCard from '../../components/common/StatCard'
import Loader from '../../components/common/Loader'
import { formatCurrency } from '../../utils/helpers'
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts'

const OwnerDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOwnerDashboard().then(r => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>

  const occupancyData = [{ name:'Used', value: data?.slotUsagePercentage || 0, fill:'#3b82f6' }]

  return (
    <PageWrapper>
      <h1 className="page-title mb-1">Owner Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">Your parking business overview</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Bookings" value={data?.totalBookings || 0} icon="📋" color="blue" index={0} />
        <StatCard title="Total Earnings" value={formatCurrency(data?.totalEarnings)} icon="💰" color="green" index={1} />
        <StatCard title="Today's Earnings" value={formatCurrency(data?.todayEarnings)} icon="📅" color="yellow" index={2} />
        <StatCard title="Avg Rating" value={`${data?.averageRating || 0} ⭐`} icon="⭐" color="pink" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-white mb-4">Slot Occupancy</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={occupancyData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={10} background={{ fill:'#1a1a2e' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              <div className="text-center mb-2">
                <div className="text-3xl font-bold gradient-text">{data?.slotUsagePercentage?.toFixed(0) || 0}%</div>
                <div className="text-xs text-gray-500">Occupied</div>
              </div>
              {[
                ['Total Slots', data?.totalSlots || 0, 'text-white'],
                ['Available', data?.availableSlots || 0, 'text-emerald-400'],
                ['Booked', data?.bookedSlots || 0, 'text-primary-400'],
              ].map(([k,v,c]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-400">{k}</span>
                  <span className={`font-semibold ${c}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <h2 className="font-semibold text-white mb-4">Revenue Summary</h2>
          <div className="space-y-4">
            {[
              ['Today', data?.todayEarnings, 'text-yellow-400'],
              ['This Month', data?.monthlyEarnings, 'text-blue-400'],
              ['All Time', data?.totalEarnings, 'text-emerald-400'],
            ].map(([label, val, color]) => (
              <div key={label} className="flex justify-between items-center p-3 bg-dark-700/50 rounded-xl">
                <span className="text-gray-400 text-sm">{label}</span>
                <span className={`font-bold ${color}`}>{formatCurrency(val)}</span>
              </div>
            ))}
            <div className="flex justify-between items-center p-3 bg-dark-700/50 rounded-xl">
              <span className="text-gray-400 text-sm">Total Reviews</span>
              <span className="font-bold text-pink-400">{data?.totalReviews || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
export default OwnerDashboard
