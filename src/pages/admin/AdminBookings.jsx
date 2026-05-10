import { useEffect, useState } from 'react'
import { getAllBookings } from '../../api/adminApi'
import PageWrapper from '../../components/common/PageWrapper'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import { formatCurrency, formatDateTime } from '../../utils/helpers'
import toast from 'react-hot-toast'

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    getAllBookings().then(r => setBookings(r.data.data || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))
  }, [])

  const statuses = ['ALL','PENDING','CONFIRMED','ACTIVE','COMPLETED','CANCELLED']
  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.bookingStatus === filter)

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 className="page-title">All Bookings <span className="text-gray-500 text-base font-normal">({bookings.length})</span></h1>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${filter === s ? 'bg-primary-600 border-primary-500 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      {loading ? <div className="flex justify-center py-20"><Loader size="lg" /></div> :
        filtered.length === 0 ? <EmptyState icon="📋" title="No bookings found" /> :
        <div className="space-y-3">
          {filtered.map(b => (
            <div key={b.id} className="card flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">#{b.id}</span>
                  <span className="text-gray-400 text-sm">{b.userName}</span>
                  <Badge status={b.bookingStatus} />
                </div>
                <div className="text-sm text-gray-400">{b.parkingAreaName} • Slot {b.slotNumber}</div>
                <div className="text-xs text-gray-500">{formatDateTime(b.startTime)} → {formatDateTime(b.endTime)}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold gradient-text">{formatCurrency(b.totalAmount)}</div>
                {b.payment && <div className="mt-1"><Badge status={b.payment.paymentStatus} /></div>}
              </div>
            </div>
          ))}
        </div>
      }
    </PageWrapper>
  )
}
export default AdminBookings
