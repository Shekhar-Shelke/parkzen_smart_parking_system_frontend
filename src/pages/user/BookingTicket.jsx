import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiDownload, FiArrowLeft } from 'react-icons/fi'
import { getBookingTicket } from '../../api/userApi'
import PageWrapper from '../../components/common/PageWrapper'
import Badge from '../../components/common/Badge'
import Loader from '../../components/common/Loader'
import { formatCurrency, formatDateTime } from '../../utils/helpers'
import toast from 'react-hot-toast'

const BookingTicket = () => {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBookingTicket(bookingId).then(r => setBooking(r.data.data)).catch(() => toast.error('Failed to load ticket')).finally(() => setLoading(false))
  }, [bookingId])

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>
  if (!booking) return <div className="text-center py-20 text-gray-400">Ticket not found</div>

  return (
    <PageWrapper>
      <Link to="/user/bookings" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-6"><FiArrowLeft /> Back to bookings</Link>
      <div className="max-w-md mx-auto">
        <div className="card border-primary-500/30 shadow-glow-blue">
          {/* Header */}
          <div className="text-center pb-5 border-b border-dashed border-white/20">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">🅿️</div>
            <h1 className="text-xl font-bold text-white">Parking Ticket</h1>
            <p className="text-gray-400 text-sm">#{booking.id}</p>
            <div className="mt-2"><Badge status={booking.bookingStatus} /></div>
          </div>
          {/* Details */}
          <div className="py-5 space-y-3">
            {[
              ['Parking Area', booking.parkingAreaName],
              ['Address', booking.parkingAreaAddress],
              ['Slot Number', booking.slotNumber],
              ['Check-in', formatDateTime(booking.startTime)],
              ['Check-out', formatDateTime(booking.endTime)],
              ['Duration', `${booking.durationHours} hour${booking.durationHours > 1 ? 's' : ''}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-gray-500">{k}</span>
                <span className="text-white font-medium text-right max-w-[55%]">{v}</span>
              </div>
            ))}
          </div>
          {/* Amount */}
          <div className="pt-5 border-t border-dashed border-white/20 text-center">
            <div className="text-gray-400 text-sm mb-1">Amount Paid</div>
            <div className="text-3xl font-black gradient-text">{formatCurrency(booking.totalAmount)}</div>
          </div>
          {/* QR */}
          {booking.qrCode && (
            <div className="mt-5 pt-5 border-t border-dashed border-white/20 flex flex-col items-center gap-2">
              <p className="text-gray-400 text-xs">Scan to verify</p>
              <img src={booking.qrCode} alt="QR Code" className="w-36 h-36 rounded-xl bg-white p-1" />
            </div>
          )}
        </div>
        <button onClick={() => window.print()} className="btn-secondary w-full mt-4 flex items-center justify-center gap-2">
          <FiDownload /> Download Ticket
        </button>
      </div>
    </PageWrapper>
  )
}
export default BookingTicket
