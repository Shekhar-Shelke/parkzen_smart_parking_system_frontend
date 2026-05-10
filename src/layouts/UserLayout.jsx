import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import MobileSidebar from '../components/layout/MobileSidebar'
const links = [
  { to:'/user/dashboard', icon:'🏠', label:'Dashboard' },
  { to:'/user/parkings', icon:'🅿️', label:'Find Parking' },
  { to:'/user/bookings', icon:'📋', label:'My Bookings' },
  { to:'/user/feedback', icon:'⭐', label:'Feedback' },
  { to:'/user/complaint', icon:'📢', label:'Complaint' },
  { to:'/user/profile', icon:'👤', label:'Profile' },
]
const UserLayout = () => (
  <div className="flex min-h-screen">
    <div className="hidden lg:flex"><Sidebar links={links} title="User Panel" /></div>
    <MobileSidebar links={links} title="User Panel" />
    <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto bg-dark-900 min-h-screen">
      <Outlet />
    </main>
  </div>
)
export default UserLayout
