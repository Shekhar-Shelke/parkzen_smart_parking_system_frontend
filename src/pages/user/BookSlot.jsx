import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiZap, FiClock } from 'react-icons/fi'
import { getParkingById, bookSlot } from '../../api/userApi'
import PageWrapper from '../../components/common/PageWrapper'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import { formatCurrency, calcBookingAmount } from '../../utils/helpers'
import toast from 'react-hot-toast'

const BookSlot = () => {
  const { parkingId } = useParams()
  const navigate = useNavigate()
  const [parking, setParking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [form, setForm] = useState({ startTime: '', durationHours: 1, requestCharging: false })

  useEffect(() => {
    getParkingById(parkingId).then(r => setParking(r.data.data)).catch(() => toast.error('Failed to load parking')).finally(() => setLoading(false))
    const now = new Date(); now.setMinutes(now.getMinutes() + 5)
    setForm(p => ({ ...p, startTime: now.toISOString().slice(0, 16) }))
  }, [parkingId])

  const totalAmount = parking ? calcBookingAmount(
    parking.pricePerHour, form.durationHours,
    form.requestCharging && parking.chargingAvailable,
    parking.chargingPricePerHour
  ) : 0

  const handleBook = async () => {
    if (!form.startTime) return toast.error('Select start time')
    setBooking(true)
    try {
      const res = await bookSlot({ parkingAreaId: parseInt(parkingId), startTime: form.startTime + ':00', durationHours: form.durationHours, requestCharging: form.requestCharging })
      const bookingData = res.data.data
      toast.success('Slot reserved! Proceed to payment.')
      navigate(`/user/payment/${bookingData.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally { setBooking(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>
  if (!parking) return <div className="text-center py-20 text-gray-400">Parking not found</div>

  return (
    <PageWrapper>
      <h1 className="page-title mb-1">Book Parking Slot</h1>
      <p className="text-gray-500 text-sm mb-6">{parking.name}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="card">
            <h2 className="font-semibold text-white mb-4">Booking Details</h2>
            <div className="space-y-4">
              <div>
                <label className="label">Start Time</label>
                <input type="datetime-local" className="input-field"
                  value={form.startTime} min={new Date().toISOString().slice(0,16)}
                  onChange={e => setForm(p => ({...p, startTime: e.target.value}))} />
              </div>
              <div>
                <label className="label">Duration</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setForm(p => ({...p, durationHours: Math.max(1, p.durationHours - 1)}))}
                    className="w-10 h-10 rounded-xl bg-dark-700 text-white hover:bg-dark-600 transition-colors font-bold">−</button>
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-bold text-white">{form.durationHours}</span>
                    <span className="text-gray-400 ml-2">hour{form.durationHours > 1 ? 's' : ''}</span>
                  </div>
                  <button onClick={() => setForm(p => ({...p, durationHours: Math.min(24, p.durationHours + 1)}))}
                    className="w-10 h-10 rounded-xl bg-dark-700 text-white hover:bg-dark-600 transition-colors font-bold">+</button>
                </div>
              </div>
              {parking.chargingAvailable && (
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-dark-700/50 border border-white/5 hover:border-emerald-500/30 transition-colors">
                  <input type="checkbox" className="w-4 h-4 accent-emerald-500"
                    checked={form.requestCharging} onChange={e => setForm(p => ({...p, requestCharging: e.target.checked}))} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-white text-sm font-medium"><FiZap className="text-emerald-400" />EV Charging</div>
                    <div className="text-xs text-gray-500">+{formatCurrency(parking.chargingPricePerHour)}/hr</div>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="card h-fit">
          <h2 className="font-semibold text-white mb-4">Price Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Parking ({form.durationHours}h × {formatCurrency(parking.pricePerHour)})</span>
              <span className="text-white">{formatCurrency(parking.pricePerHour * form.durationHours)}</span>
            </div>
            {form.requestCharging && parking.chargingAvailable && (
              <div className="flex justify-between text-gray-400">
                <span>EV Charging ({form.durationHours}h × {formatCurrency(parking.chargingPricePerHour)})</span>
                <span className="text-emerald-400">{formatCurrency(parking.chargingPricePerHour * form.durationHours)}</span>
              </div>
            )}
            <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg">
              <span className="text-white">Total</span>
              <span className="gradient-text">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
          <Button onClick={handleBook} loading={booking} className="w-full mt-5">
            Reserve & Pay {formatCurrency(totalAmount)}
          </Button>
          <p className="text-xs text-gray-500 text-center mt-2">Slot reserved. Payment required to confirm.</p>
        </div>
      </div>
    </PageWrapper>
  )
}
export default BookSlot
