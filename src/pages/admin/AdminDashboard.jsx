import { useEffect, useState } from 'react'
import { getAdminDashboard } from '../../api/adminApi'
import PageWrapper from '../../components/common/PageWrapper'
import StatCard from '../../components/common/StatCard'
import Loader from '../../components/common/Loader'
import { formatCurrency } from '../../utils/helpers'

const AdminDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminDashboard().then(r => setData(r.data.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>

  const stats = [
    { title:'Total Users', value: data?.totalUsers || 0, icon:'👥', color:'blue' },
    { title:'Total Owners', value: data?.totalOwners || 0, icon:'🏢', color:'purple' },
    { title:'Total Revenue', value: formatCurrency(data?.totalRevenue), icon:'💰', color:'green' },
    { title:'Active Bookings', value: data?.activeBookings || 0, icon:'✅', color:'yellow' },
    { title:'Total Bookings', value: data?.totalBookings || 0, icon:'📋', color:'blue' },
    { title:'Pending Complaints', value: data?.pendingComplaints || 0, icon:'📢', color:'red' },
    { title:'Transactions', value: data?.totalTransactions || 0, icon:'💳', color:'pink' },
    { title:'Pending Approvals', value: data?.pendingOwnerApprovals || 0, icon:'⏳', color:'yellow' },
  ]

  return (
    <PageWrapper>
      <h1 className="page-title mb-1">Admin Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">System-wide overview</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={s.title} {...s} index={i} />)}
      </div>
    </PageWrapper>
  )
}
export default AdminDashboard
