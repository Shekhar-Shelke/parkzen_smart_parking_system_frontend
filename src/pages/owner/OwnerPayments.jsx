import { useEffect, useState } from 'react'
import { getOwnerPayments } from '../../api/ownerApi'
import PageWrapper from '../../components/common/PageWrapper'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import { formatCurrency, formatDateTime } from '../../utils/helpers'
import toast from 'react-hot-toast'

const OwnerPayments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOwnerPayments().then(r => setPayments(r.data.data || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))
  }, [])

  const total = payments.filter(p => p.paymentStatus === 'SUCCESS').reduce((s, p) => s + p.amount, 0)

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Payments</h1>
        <div className="card py-2 px-4 text-right">
          <div className="text-xs text-gray-400">Total Earned</div>
          <div className="font-bold gradient-text">{formatCurrency(total)}</div>
        </div>
      </div>
      {loading ? <div className="flex justify-center py-20"><Loader size="lg" /></div> :
        payments.length === 0 ? <EmptyState icon="💳" title="No payments yet" message="Payments will appear once bookings are confirmed." /> :
        <div className="space-y-3">
          {payments.map(p => (
            <div key={p.id} className="card flex items-center justify-between gap-4">
              <div>
                <div className="font-medium text-white text-sm">Booking #{p.bookingId}</div>
                <div className="text-xs text-gray-500 mt-0.5">{p.razorpayOrderId} • {formatDateTime(p.paymentTime)}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">{formatCurrency(p.amount)}</div>
                <div className="mt-1"><Badge status={p.paymentStatus} /></div>
              </div>
            </div>
          ))}
        </div>
      }
    </PageWrapper>
  )
}
export default OwnerPayments
