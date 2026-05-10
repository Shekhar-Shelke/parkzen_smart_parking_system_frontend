import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ProtectedRoute from './ProtectedRoute'
import Loader from '../components/common/Loader'
import { useAuth } from '../context/AuthContext'

// Layouts
import PublicLayout from '../layouts/PublicLayout'
import UserLayout from '../layouts/UserLayout'
import OwnerLayout from '../layouts/OwnerLayout'
import AdminLayout from '../layouts/AdminLayout'

// Auth
import UserLogin from '../pages/auth/UserLogin'
import UserRegister from '../pages/auth/UserRegister'
import OwnerLogin from '../pages/auth/OwnerLogin'
import OwnerRegister from '../pages/auth/OwnerRegister'
import AdminLogin from '../pages/auth/AdminLogin'

// Public
import HomePage from '../pages/public/HomePage'
import AboutPage from '../pages/public/AboutPage'
import ContactPage from '../pages/public/ContactPage'
import NotFoundPage from '../pages/public/NotFoundPage'
import UnauthorizedPage from '../pages/public/UnauthorizedPage'

// User
import UserDashboard from '../pages/user/UserDashboard'
import NearbyParkings from '../pages/user/NearbyParkings'
import ParkingDetails from '../pages/user/ParkingDetails'
import ParkingSlots from '../pages/user/ParkingSlots'
import BookSlot from '../pages/user/BookSlot'
import PaymentPage from '../pages/user/PaymentPage'
import BookingHistory from '../pages/user/BookingHistory'
import BookingTicket from '../pages/user/BookingTicket'
import UserProfile from '../pages/user/UserProfile'
import FeedbackForm from '../pages/user/FeedbackForm'
import ComplaintForm from '../pages/user/ComplaintForm'

// Owner
import OwnerDashboard from '../pages/owner/OwnerDashboard'
import ManageSlots from '../pages/owner/ManageSlots'
import OwnerBookings from '../pages/owner/OwnerBookings'
import OwnerPayments from '../pages/owner/OwnerPayments'
import OwnerAnalytics from '../pages/owner/OwnerAnalytics'
import OwnerReviews from '../pages/owner/OwnerReviews'

// Admin
import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageUsers from '../pages/admin/ManageUsers'
import ManageOwners from '../pages/admin/ManageOwners'
import AdminBookings from '../pages/admin/AdminBookings'
import AdminPayments from '../pages/admin/AdminPayments'
import AdminComplaints from '../pages/admin/AdminComplaints'
import AdminMessages from '../pages/admin/AdminMessages'
import AlertsPage from '../pages/admin/AlertsPage'

const RedirectByRole = () => {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated) return <HomePage />
  if (role === 'ROLE_USER') return <Navigate to="/user/dashboard" replace />
  if (role === 'ROLE_OWNER') return <Navigate to="/owner/dashboard" replace />
  if (role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />
  return <HomePage />
}

const AppRoutes = () => (
  <Suspense fallback={<Loader fullScreen />}>
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<RedirectByRole />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="/owner/login" element={<OwnerLogin />} />
      <Route path="/owner/register" element={<OwnerRegister />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* User */}
      <Route path="/user" element={<ProtectedRoute allowedRoles={['ROLE_USER']}><UserLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="parkings" element={<NearbyParkings />} />
        <Route path="parking/:id" element={<ParkingDetails />} />
        <Route path="parking/:id/slots" element={<ParkingSlots />} />
        <Route path="book/:parkingId" element={<BookSlot />} />
        <Route path="payment/:bookingId" element={<PaymentPage />} />
        <Route path="bookings" element={<BookingHistory />} />
        <Route path="ticket/:bookingId" element={<BookingTicket />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="feedback" element={<FeedbackForm />} />
        <Route path="complaint" element={<ComplaintForm />} />
      </Route>

      {/* Owner */}
      <Route path="/owner" element={<ProtectedRoute allowedRoles={['ROLE_OWNER']}><OwnerLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="slots" element={<ManageSlots />} />
        <Route path="bookings" element={<OwnerBookings />} />
        <Route path="payments" element={<OwnerPayments />} />
        <Route path="analytics" element={<OwnerAnalytics />} />
        <Route path="reviews" element={<OwnerReviews />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}><AdminLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="owners" element={<ManageOwners />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="alerts" element={<AlertsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
)

export default AppRoutes
