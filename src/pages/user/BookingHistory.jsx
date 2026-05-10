import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBookingHistory } from '../../api/userApi'
import PageWrapper from '../../components/common/PageWrapper'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import { formatCurrency, formatDateTime } from '../../utils/helpers'
import toast from 'react-hot-toast'

const BookingHistory = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBookingHistory().then(r => setBookings(r.data.data || [])).catch(() => toast.error('Failed to load bookings')).finally(() => setLoading(false))
  }, [])

  return (
    <PageWrapper>
      <h1 className="page-title mb-6">My Bookings</h1>
      {loading ? <div className="flex justify-center py-20"><Loader size="lg" /></div> :
        bookings.length === 0 ? <EmptyState icon="📋" title="No bookings yet" message="Start by finding a parking spot near you." /> :
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b.id} className="card hover:border-primary-500/30 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white truncate">{b.parkingAreaName}</span>
                    <Badge status={b.bookingStatus} />
                  </div>
                  <div className="text-sm text-gray-400">{b.parkingAreaAddress}</div>
                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div><span className="text-gray-500">Slot: </span><span className="text-white">{b.slotNumber}</span></div>
                    <div><span className="text-gray-500">Duration: </span><span className="text-white">{b.durationHours}h</span></div>
                    <div><span className="text-gray-500">In: </span><span className="text-white">{formatDateTime(b.startTime)}</span></div>
                    <div><span className="text-gray-500">Out: </span><span className="text-white">{formatDateTime(b.endTime)}</span></div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-bold gradient-text">{formatCurrency(b.totalAmount)}</div>
                  <div className="mt-2 space-y-1">
                    <Link to={`/user/ticket/${b.id}`} className="btn-secondary text-xs py-1.5 px-3 block text-center">View Ticket</Link>
                    {['CONFIRMED','ACTIVE'].includes(b.bookingStatus) && (
                      <Link to={`/user/payment/${b.id}`} className="btn-primary text-xs py-1.5 px-3 block text-center">Extend</Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </PageWrapper>
  )
}
export default BookingHistory
