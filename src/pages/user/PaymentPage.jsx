import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiShield } from 'react-icons/fi'
import { getBookingTicket, createPaymentOrder, verifyPayment } from '../../api/userApi'
import PageWrapper from '../../components/common/PageWrapper'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import { formatCurrency, formatDateTime } from '../../utils/helpers'
import toast from 'react-hot-toast'

const PaymentPage = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    getBookingTicket(bookingId).then(r => setBooking(r.data.data)).catch(() => toast.error('Failed to load booking')).finally(() => setLoading(false))
  }, [bookingId])

  const handlePayment = async () => {
    setPaying(true)
    try {
      const orderRes = await createPaymentOrder(bookingId)
      const { razorpayOrderId, amount, razorpayKey } = orderRes.data.data

      const options = {
        key: razorpayKey || import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount * 100,
        currency: 'INR',
        name: 'ParkZen',
        description: `Booking #${bookingId}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            await verifyPayment({
              bookingId: parseInt(bookingId),
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            })
            toast.success('Payment successful! Booking confirmed.')
            navigate(`/user/ticket/${bookingId}`)
          } catch { toast.error('Payment verification failed') }
        },
        prefill: { name: 'ParkZen User', email: 'user@parkzen.com' },
        theme: { color: '#3b82f6' },
        modal: { ondismiss: () => { toast.error('Payment cancelled'); setPaying(false) } }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initialize payment')
      setPaying(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>
  if (!booking) return <div className="text-center py-20 text-gray-400">Booking not found</div>

  return (
    <PageWrapper>
      <h1 className="page-title mb-6">Complete Payment</h1>
      <div className="max-w-md mx-auto">
        <div className="card mb-4">
          <h2 className="font-semibold text-white mb-4">Booking Summary</h2>
          <div className="space-y-3 text-sm">
            {[
              ['Parking', booking.parkingAreaName],
              ['Slot', booking.slotNumber],
              ['Check-in', formatDateTime(booking.startTime)],
              ['Check-out', formatDateTime(booking.endTime)],
              ['Duration', `${booking.durationHours} hour${booking.durationHours > 1 ? 's' : ''}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-400">{k}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-base">
              <span className="text-white">Total Amount</span>
              <span className="gradient-text">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
            <FiShield className="text-emerald-400" /> Secured by Razorpay
          </div>
          <Button onClick={handlePayment} loading={paying} className="w-full py-4 text-base">
            Pay {formatCurrency(booking.totalAmount)}
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">Your booking is reserved for 15 minutes. Complete payment to confirm.</p>
      </div>
    </PageWrapper>
  )
}
export default PaymentPage
