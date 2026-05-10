import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/common/Loader'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loader fullScreen />
  if (!isAuthenticated) return <Navigate to="/" state={{ from: location }} replace />
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />
  return children
}

export default ProtectedRoute
