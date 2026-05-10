import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin, FiZap, FiSearch } from 'react-icons/fi'
import { getNearbyParkings } from '../../api/userApi'
import PageWrapper from '../../components/common/PageWrapper'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'

const NearbyParkings = () => {
  const [parkings, setParkings] = useState([])
  const [loading, setLoading] = useState(false)
  const [radius, setRadius] = useState(10)
  const [location, setLocation] = useState(null)

  const fetchLocation = () => {
    setLoading(true)
    navigator.geolocation?.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        setLocation({ lat: latitude, lng: longitude })
        getNearbyParkings(latitude, longitude, radius)
          .then(r => setParkings(r.data.data || []))
          .catch(() => toast.error('Failed to fetch parkings'))
          .finally(() => setLoading(false))
      },
      () => {
        // Default to Mumbai coords
        const lat = 18.9220, lng = 72.8347
        setLocation({ lat, lng })
        getNearbyParkings(lat, lng, radius)
          .then(r => setParkings(r.data.data || []))
          .catch(() => toast.error('Failed to fetch parkings'))
          .finally(() => setLoading(false))
      }
    )
  }

  useEffect(() => { fetchLocation() }, [radius])

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Nearby Parking</h1>
          <p className="text-gray-500 text-sm">{location ? 'Showing results near your location' : 'Getting your location...'}</p>
        </div>
        <select value={radius} onChange={e => setRadius(Number(e.target.value))}
          className="input-field w-auto py-2 text-sm">
          {[5,10,20,50].map(r => <option key={r} value={r}>{r} km</option>)}
        </select>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader size="lg" /></div> :
        parkings.length === 0 ? <EmptyState icon="🅿️" title="No parkings found" message="Try increasing the search radius." /> :
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {parkings.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/user/parking/${p.id}`}>
                <div className="card-hover group">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-primary-300 transition-colors">{p.name}</h3>
                      <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                        <FiMapPin size={10} />{p.address}
                      </div>
                    </div>
                    {p.chargingAvailable && (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                        <FiZap size={10} />EV
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-dark-700/50 rounded-lg p-2.5 text-center">
                      <div className="text-lg font-bold text-white">{p.availableSlots}</div>
                      <div className="text-xs text-gray-500">Available</div>
                    </div>
                    <div className="bg-dark-700/50 rounded-lg p-2.5 text-center">
                      <div className="text-lg font-bold text-primary-400">{formatCurrency(p.pricePerHour)}</div>
                      <div className="text-xs text-gray-500">per hour</div>
                    </div>
                  </div>
                  {p.distanceKm && (
                    <div className="mt-3 text-xs text-gray-500 text-right">{p.distanceKm} km away</div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      }
    </PageWrapper>
  )
}
export default NearbyParkings
