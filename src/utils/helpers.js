export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR' }).format(amount || 0)

export const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '-'

export const formatDateTime = (date) =>
  date ? new Date(date).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '-'

export const calcBookingAmount = (pricePerHour, durationHours, chargingEnabled, chargingPricePerHour) => {
  let total = pricePerHour * durationHours
  if (chargingEnabled && chargingPricePerHour) total += chargingPricePerHour * durationHours
  return Math.round(total * 100) / 100
}

export const getStatusColor = (status) => {
  const map = {
    CONFIRMED:'text-emerald-400', ACTIVE:'text-emerald-400', SUCCESS:'text-emerald-400',
    PENDING:'text-yellow-400', EXTENDED:'text-blue-400',
    CANCELLED:'text-red-400', FAILED:'text-red-400',
    COMPLETED:'text-gray-400', CLOSED:'text-gray-400'
  }
  return map[status] || 'text-gray-400'
}

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
export const validatePhone = (phone) => /^[6-9][0-9]{9}$/.test(phone)
export const validateVehicle = (v) => /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(v)
