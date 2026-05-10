import { useEffect, useState } from 'react'
import { getOwnerBookings } from '../../api/ownerApi'
import PageWrapper from '../../components/common/PageWrapper'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import { formatCurrency, formatDateTime } from '../../utils/helpers'
import toast from 'react-hot-toast'

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOwnerBookings().then(r => setBookings(r.data.data || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))
  }, [])

  return (
    <PageWrapper>
      <h1 className="page-title mb-6">Booking Management</h1>
      {loading ? <div className="flex justify-center py-20"><Loader size="lg" /></div> :
        bookings.length === 0 ? <EmptyState icon="📋" title="No bookings yet" message="Bookings will appear here once users start reserving slots." /> :
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.id} className="card">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">#{b.id}</span>
                    <span className="text-gray-400 text-sm">— {b.userName}</span>
                    <Badge status={b.bookingStatus} />
                  </div>
                  <div className="text-xs text-gray-500">Slot {b.slotNumber} • {formatDateTime(b.startTime)} → {formatDateTime(b.endTime)} • {b.durationHours}h</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold gradient-text">{formatCurrency(b.totalAmount)}</div>
                  {b.payment && <Badge status={b.payment.paymentStatus} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </PageWrapper>
  )
}
export default OwnerBookings
