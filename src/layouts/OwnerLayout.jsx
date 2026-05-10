import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import MobileSidebar from '../components/layout/MobileSidebar'
const links = [
  { to:'/owner/dashboard', icon:'📊', label:'Dashboard' },
  { to:'/owner/slots', icon:'🅿️', label:'Manage Slots' },
  { to:'/owner/bookings', icon:'📋', label:'Bookings' },
  { to:'/owner/payments', icon:'💳', label:'Payments' },
  { to:'/owner/analytics', icon:'📈', label:'Analytics' },
  { to:'/owner/reviews', icon:'⭐', label:'Reviews' },
]
const OwnerLayout = () => (
  <div className="flex min-h-screen">
    <div className="hidden lg:flex"><Sidebar links={links} title="Owner Panel" /></div>
    <MobileSidebar links={links} title="Owner Panel" />
    <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto bg-dark-900 min-h-screen">
      <Outlet />
    </main>
  </div>
)
export default OwnerLayout
