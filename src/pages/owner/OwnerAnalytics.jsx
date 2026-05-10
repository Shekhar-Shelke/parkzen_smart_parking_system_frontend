import { useEffect, useState } from 'react'
import { getOwnerAnalytics } from '../../api/ownerApi'
import PageWrapper from '../../components/common/PageWrapper'
import StatCard from '../../components/common/StatCard'
import Loader from '../../components/common/Loader'
import { formatCurrency } from '../../utils/helpers'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#3b82f6','#8b5cf6','#10b981','#f59e0b']

const OwnerAnalytics = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOwnerAnalytics().then(r => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>

  const barData = [
    { name:'Today', amount: data?.todayEarnings || 0 },
    { name:'Monthly', amount: data?.monthlyEarnings || 0 },
    { name:'Total', amount: data?.totalEarnings || 0 },
  ]

  const pieData = [
    { name:'Available', value: data?.availableSlots || 0 },
    { name:'Booked', value: data?.bookedSlots || 0 },
  ]

  return (
    <PageWrapper>
      <h1 className="page-title mb-6">Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Bookings" value={data?.totalBookings || 0} icon="📋" color="blue" index={0} />
        <StatCard title="Total Earnings" value={formatCurrency(data?.totalEarnings)} icon="💰" color="green" index={1} />
        <StatCard title="Occupancy" value={`${data?.slotUsagePercentage?.toFixed(0) || 0}%`} icon="🅿️" color="purple" index={2} />
        <StatCard title="Avg Rating" value={`${data?.averageRating || 0}⭐`} icon="⭐" color="yellow" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-white mb-4">Revenue Breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="name" stroke="#6b7280" tick={{ fill:'#9ca3af', fontSize:12 }} />
              <YAxis stroke="#6b7280" tick={{ fill:'#9ca3af', fontSize:12 }} />
              <Tooltip contentStyle={{ background:'#1a1a2e', border:'1px solid #ffffff20', borderRadius:'12px', color:'#fff' }} formatter={v => [formatCurrency(v), 'Earnings']} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold text-white mb-4">Slot Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background:'#1a1a2e', border:'1px solid #ffffff20', borderRadius:'12px', color:'#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ background:COLORS[i] }} />
                <span className="text-gray-400">{d.name}: <span className="text-white font-medium">{d.value}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
export default OwnerAnalytics
