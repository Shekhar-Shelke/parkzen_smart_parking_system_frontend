import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiZap } from 'react-icons/fi'
import { getSlotsByParking } from '../../api/userApi'
import PageWrapper from '../../components/common/PageWrapper'
import Loader from '../../components/common/Loader'
import Badge from '../../components/common/Badge'
import toast from 'react-hot-toast'

const ParkingSlots = () => {
  const { id } = useParams()
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSlotsByParking(id).then(r => setSlots(r.data.data || [])).catch(() => toast.error('Failed to load slots')).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>

  return (
    <PageWrapper>
      <Link to={`/user/parking/${id}`} className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-5">← Back to parking</Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Parking Slots — {slots[0]?.parkingAreaName}</h1>
        <Link to={`/user/book/${id}`} className="btn-primary text-sm py-2">Book a Slot</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {slots.map(slot => (
          <div key={slot.id} className={`rounded-xl p-4 border text-center transition-all ${
            slot.availabilityStatus === 'AVAILABLE' ? 'bg-emerald-500/10 border-emerald-500/30' :
            slot.availabilityStatus === 'BOOKED' ? 'bg-red-500/10 border-red-500/30 opacity-60' :
            'bg-gray-500/10 border-gray-500/30 opacity-50'}`}>
            <div className="font-bold text-white text-lg">{slot.slotNumber}</div>
            <div className="text-xs text-gray-400 mt-1">{slot.slotType}</div>
            {slot.chargingEnabled && <FiZap className="text-emerald-400 mx-auto mt-1" size={12} />}
            <div className="mt-2"><Badge status={slot.availabilityStatus} /></div>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
export default ParkingSlots
