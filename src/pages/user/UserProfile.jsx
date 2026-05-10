import { useAuth } from '../../context/AuthContext'
import PageWrapper from '../../components/common/PageWrapper'
import { formatDate } from '../../utils/helpers'

const UserProfile = () => {
  const { user, logout } = useAuth()
  return (
    <PageWrapper>
      <h1 className="page-title mb-6">My Profile</h1>
      <div className="max-w-lg">
        <div className="card mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <span className="badge badge-info mt-1">{user?.role?.replace('ROLE_','')}</span>
            </div>
          </div>
          <div className="space-y-3">
            {[
              ['Email', user?.email],
              ['Mobile', user?.mobileNumber || 'Not set'],
              ['Vehicle', user?.vehicleNumber || 'Not set'],
              ['Member Since', formatDate(user?.createdAt)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between p-3 bg-dark-700/50 rounded-xl text-sm">
                <span className="text-gray-400">{k}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={logout} className="btn-danger w-full">Logout</button>
      </div>
    </PageWrapper>
  )
}
export default UserProfile
