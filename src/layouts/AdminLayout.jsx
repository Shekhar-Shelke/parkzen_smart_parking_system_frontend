import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import MobileSidebar from '../components/layout/MobileSidebar'
const links = [
  { to:'/admin/dashboard', icon:'📊', label:'Dashboard' },
  { to:'/admin/users', icon:'👥', label:'Users' },
  { to:'/admin/owners', icon:'🏢', label:'Owners' },
  { to:'/admin/bookings', icon:'📋', label:'Bookings' },
  { to:'/admin/payments', icon:'💳', label:'Payments' },
  { to:'/admin/complaints', icon:'📢', label:'Complaints' },
  { to:'/admin/messages', icon:'✉️', label:'Messages' },
  { to:'/admin/alerts', icon:'🚨', label:'Alerts' },
]
const AdminLayout = () => (
  <div className="flex min-h-screen">
    <div className="hidden lg:flex"><Sidebar links={links} title="Admin Panel" /></div>
    <MobileSidebar links={links} title="Admin Panel" />
    <main className="flex-1 p-4 lg:p-8 pt-16 lg:pt-8 overflow-auto bg-dark-900 min-h-screen">
      <Outlet />
    </main>
  </div>
)
export default AdminLayout
