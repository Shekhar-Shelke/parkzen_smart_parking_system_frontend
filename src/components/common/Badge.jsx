const Badge = ({ status }) => {
  const map = {
    CONFIRMED: 'badge-success',
    ACTIVE: 'badge-success',
    COMPLETED: 'badge-info',
    PENDING: 'badge-warning',
    CANCELLED: 'badge-danger',
    EXTENDED: 'badge-info',
    SUCCESS: 'badge-success',
    FAILED: 'badge-danger',
    AVAILABLE: 'badge-success',
    BOOKED: 'badge-warning',
    MAINTENANCE: 'badge-danger',
    OPEN: 'badge-warning',
    RESOLVED: 'badge-success',
    IN_PROGRESS: 'badge-info',
    CLOSED: 'badge-info',
    true: 'badge-success',
    false: 'badge-danger',
  }
  return <span className={map[status] || 'badge bg-gray-500/20 text-gray-400'}>{String(status)}</span>
}
export default Badge
