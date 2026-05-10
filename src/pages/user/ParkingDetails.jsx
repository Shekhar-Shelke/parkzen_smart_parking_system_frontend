import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiZap } from 'react-icons/fi'
import { getParkingById } from '../../api/userApi'
import PageWrapper from '../../components/common/PageWrapper'
import Loader from '../../components/common/Loader'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

const ParkingDetails = () => {
  const { id } = useParams()
  const [parking, setParking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getParkingById(id).then(r => setParking(r.data.data)).catch(() => toast.error('Failed to load parking')).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>
  if (!parking) return <div className="text-center py-20 text-gray-400">Parking not found</div>

  const occupancyPct = Math.round(((parking.totalSlots - parking.availableSlots) / parking.totalSlots) * 100)

  return (
    <PageWrapper>
      <Link to="/user/parkings" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-5">← Back to parkings</Link>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">{parking.name}</h1>
                <div className="flex items-center gap-1 text-gray-400 text-sm mt-1"><FiMapPin size={12} />{parking.address}</div>
              </div>
              <span className={`badge ${parking.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>{parking.status}</span>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-sm text-gray-400 mb-1.5">
                <span>Occupancy</span><span>{occupancyPct}%</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all ${occupancyPct > 80 ? 'bg-red-500' : occupancyPct > 50 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                  style={{ width: `${occupancyPct}%` }} />
              </div>
              <div className="text-xs text-gray-500 mt-1">{parking.availableSlots} of {parking.totalSlots} slots available</div>
            </div>
          </div>
          <div className="card">
            <h2 className="font-semibold text-white mb-3">Parking Details</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Total Slots', parking.totalSlots],
                ['Available', parking.availableSlots],
                ['Price/Hour', formatCurrency(parking.pricePerHour)],
                ['Managed by', parking.ownerName],
              ].map(([k, v]) => (
                <div key={k} className="bg-dark-700/50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-0.5">{k}</div>
                  <div className="font-semibold text-white">{v}</div>
                </div>
              ))}
            </div>
            {parking.chargingAvailable && (
              <div className="mt-3 flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                <FiZap /> EV Charging Available • {formatCurrency(parking.chargingPricePerHour)}/hr extra
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card text-center">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-3xl font-bold gradient-text">{formatCurrency(parking.pricePerHour)}</div>
            <div className="text-gray-400 text-sm mb-5">per hour</div>
            {parking.availableSlots > 0 ? (
              <div className="space-y-2">
                <Link to={`/user/parking/${id}/slots`} className="btn-secondary block text-center text-sm">View Slots</Link>
                <Link to={`/user/book/${id}`} className="btn-primary block text-center text-sm">Book Now</Link>
              </div>
            ) : (
              <div className="text-red-400 font-medium">No slots available</div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
export default ParkingDetails
