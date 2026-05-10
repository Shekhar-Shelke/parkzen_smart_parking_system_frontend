import { useEffect, useState } from 'react'
import { getAllPayments } from '../../api/adminApi'
import PageWrapper from '../../components/common/PageWrapper'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import StatCard from '../../components/common/StatCard'
import { formatCurrency, formatDateTime } from '../../utils/helpers'
import toast from 'react-hot-toast'

const AdminPayments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllPayments().then(r => setPayments(r.data.data || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))
  }, [])

  const totalRevenue = payments.filter(p => p.paymentStatus === 'SUCCESS').reduce((s, p) => s + p.amount, 0)
  const failed = payments.filter(p => p.paymentStatus === 'FAILED').length

  return (
    <PageWrapper>
      <h1 className="page-title mb-5">All Payments</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon="💰" color="green" index={0} />
        <StatCard title="Total Transactions" value={payments.length} icon="💳" color="blue" index={1} />
        <StatCard title="Successful" value={payments.filter(p => p.paymentStatus === 'SUCCESS').length} icon="✅" color="green" index={2} />
        <StatCard title="Failed" value={failed} icon="❌" color="red" index={3} />
      </div>
      {loading ? <div className="flex justify-center py-20"><Loader size="lg" /></div> :
        payments.length === 0 ? <EmptyState icon="💳" title="No payments found" /> :
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>{['Order ID','Booking','Amount','Status','Time'].map(h => <th key={h} className="text-left text-gray-400 font-medium px-4 py-3">{h}</th>)}</tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.razorpayOrderId || '-'}</td>
                    <td className="px-4 py-3 text-white">#{p.bookingId}</td>
                    <td className="px-4 py-3 font-semibold text-white">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-3"><Badge status={p.paymentStatus} /></td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDateTime(p.paymentTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
    </PageWrapper>
  )
}
export default AdminPayments
