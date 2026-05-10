import { useEffect, useState } from 'react'
import { getAllUsers } from '../../api/adminApi'
import PageWrapper from '../../components/common/PageWrapper'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getAllUsers().then(r => setUsers(r.data.data || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="page-title">Manage Users <span className="text-gray-500 text-base font-normal">({users.length})</span></h1>
        <input className="input-field w-64 py-2 text-sm" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {loading ? <div className="flex justify-center py-20"><Loader size="lg" /></div> :
        filtered.length === 0 ? <EmptyState icon="👥" title="No users found" /> :
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>{['Name','Email','Mobile','Vehicle','Joined'].map(h => <th key={h} className="text-left text-gray-400 font-medium px-4 py-3">{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/2'}`}>
                    <td className="px-4 py-3 font-medium text-white">{u.name}</td>
                    <td className="px-4 py-3 text-gray-400">{u.email}</td>
                    <td className="px-4 py-3 text-gray-400">{u.mobileNumber || '-'}</td>
                    <td className="px-4 py-3 text-gray-400">{u.vehicleNumber || '-'}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
    </PageWrapper>
  )
}
export default ManageUsers
