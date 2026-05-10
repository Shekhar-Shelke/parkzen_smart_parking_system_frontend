import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMapPin, FiMail, FiLock, FiUser, FiNavigation, FiCheck, FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { registerOwner } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const OwnerRegister = () => {
  const [form, setForm] = useState({
    name: '',
    parkingAreaName: '',
    address: '',
    latitude: '',
    longitude: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [locLoading, setLocLoading] = useState(false)
  const [locationCaptured, setLocationCaptured] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [errors, setErrors] = useState({})
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  // ── Geolocation handler ──────────────────────────────────────────
  const handleGetLocation = () => {
    setLocationError('')
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.')
      return
    }
    setLocLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setForm(p => ({
          ...p,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6)
        }))
        setLocationCaptured(true)

        // Reverse geocode to auto-fill address using OpenStreetMap Nominatim (free)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await res.json()
          if (data?.display_name) {
            setForm(p => ({ ...p, address: data.display_name }))
          }
        } catch {
          // address stays as-is if reverse geocode fails
        }

        toast.success('📍 Location captured successfully!')
        setLocLoading(false)
      },
      (err) => {
        setLocLoading(false)
        setLocationCaptured(false)
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError('Location access denied. Please allow location permission and try again.')
            break
          case err.POSITION_UNAVAILABLE:
            setLocationError('Location unavailable. Check your GPS/network.')
            break
          case err.TIMEOUT:
            setLocationError('Location request timed out. Try again.')
            break
          default:
            setLocationError('Unable to get location. Please enter manually.')
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.parkingAreaName.trim()) e.parkingAreaName = 'Parking area name is required'
    if (!form.address.trim()) e.address = 'Address is required'
    if (!form.latitude) e.location = 'Please capture your location'
    if (!form.longitude) e.location = 'Please capture your location'
    if (!form.email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude)
      }
      const res = await registerOwner(payload)
      const { token, ...userData } = res.data.data
      login(userData, token)
      toast.success('Registered! Awaiting admin approval.')
      navigate('/owner/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 py-12">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 w-full max-w-lg z-10 shadow-glass"
      >
        {/* Header */}
        <div className="text-center mb-7">
          <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🏢</div>
          <h1 className="text-2xl font-bold text-white">Owner Registration</h1>
          <p className="text-gray-500 text-sm mt-1">List your parking space on ParkZen</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Personal Info */}
          <Input
            label="Your Full Name"
            placeholder="John Smith"
            icon={<FiUser />}
            value={form.name}
            onChange={set('name')}
            error={errors.name}
          />

          <Input
            label="Parking Area Name"
            placeholder="Downtown Parking Zone"
            value={form.parkingAreaName}
            onChange={set('parkingAreaName')}
            error={errors.parkingAreaName}
          />

          {/* ── Location Section ─────────────────────────────────── */}
          <div className="space-y-2">
            <label className="label flex items-center gap-1">
              <FiMapPin size={13} /> Parking Location
            </label>

            {/* Detect Location Button */}
            <motion.button
              type="button"
              onClick={handleGetLocation}
              disabled={locLoading}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border-2 font-semibold text-sm transition-all duration-300
                ${locationCaptured
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                  : 'border-dashed border-primary-500/50 bg-primary-500/5 text-primary-400 hover:border-primary-400 hover:bg-primary-500/10'
                } ${locLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <AnimatePresence mode="wait">
                {locLoading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="w-5 h-5 border-2 border-primary-500/30 border-t-primary-400 rounded-full animate-spin" />
                ) : locationCaptured ? (
                  <motion.div key="done" initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <FiCheck size={11} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <FiNavigation size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
              {locLoading ? 'Getting your location…' : locationCaptured ? 'Location Captured!' : 'Detect My Live Location'}
            </motion.button>

            {/* Error */}
            <AnimatePresence>
              {locationError && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  <FiAlertCircle className="mt-0.5 shrink-0" />
                  <span>{locationError}</span>
                </motion.div>
              )}
            </AnimatePresence>
            {errors.location && <p className="text-xs text-red-400">{errors.location}</p>}

            {/* Coordinates Display */}
            <AnimatePresence>
              {locationCaptured && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="grid grid-cols-2 gap-2">
                  <div className="bg-dark-700/60 border border-emerald-500/20 rounded-xl px-3 py-2.5">
                    <div className="text-xs text-gray-500 mb-0.5">Latitude</div>
                    <div className="text-sm font-mono text-emerald-400">{form.latitude}</div>
                  </div>
                  <div className="bg-dark-700/60 border border-emerald-500/20 rounded-xl px-3 py-2.5">
                    <div className="text-xs text-gray-500 mb-0.5">Longitude</div>
                    <div className="text-sm font-mono text-emerald-400">{form.longitude}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Manual override (small) */}
            {locationCaptured && (
              <p className="text-xs text-gray-600 text-center">
                Not accurate?{' '}
                <button type="button" onClick={handleGetLocation} className="text-primary-500 hover:text-primary-400 underline">
                  Detect again
                </button>
                {' '}or edit the coordinates manually below.
              </p>
            )}

            {/* Manual input fallback */}
            {!locationCaptured && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude (e.g. 18.9220)"
                    className="input-field text-sm py-2.5"
                    value={form.latitude}
                    onChange={e => setForm(p => ({ ...p, latitude: e.target.value }))}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="any"
                    placeholder="Longitude (e.g. 72.8347)"
                    className="input-field text-sm py-2.5"
                    value={form.longitude}
                    onChange={e => setForm(p => ({ ...p, longitude: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </div>
          {/* ── End Location Section ─────────────────────────────── */}

          {/* Address (auto-filled or manual) */}
          <div>
            <label className="label">Parking Address</label>
            <textarea
              className="input-field resize-none min-h-20 text-sm"
              placeholder="Full address of your parking area"
              value={form.address}
              onChange={set('address')}
            />
            {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
            {locationCaptured && form.address && (
              <p className="text-xs text-emerald-500 mt-1">✓ Auto-filled from location</p>
            )}
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="owner@email.com"
            icon={<FiMail />}
            value={form.email}
            onChange={set('email')}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Min 6 characters"
            icon={<FiLock />}
            value={form.password}
            onChange={set('password')}
            error={errors.password}
          />

          <Button type="submit" loading={loading} className="w-full mt-2">
            Register as Owner
          </Button>
        </form>

        {/* Admin approval notice */}
        <div className="mt-5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 text-center">
          <p className="text-yellow-400 text-xs font-medium">⏳ Your account requires admin approval before you can list parking slots.</p>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Already registered?{' '}
          <Link to="/owner/login" className="text-primary-400 hover:text-primary-300 font-medium">Login</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default OwnerRegister
