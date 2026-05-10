import { useEffect, useState } from 'react'
import { getAllComplaints } from '../../api/adminApi'
import PageWrapper from '../../components/common/PageWrapper'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllComplaints().then(r => setComplaints(r.data.data || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))
  }, [])

  return (
    <PageWrapper>
      <h1 className="page-title mb-6">Complaints <span className="text-gray-500 text-base font-normal">({complaints.length})</span></h1>
      {loading ? <div className="flex justify-center py-20"><Loader size="lg" /></div> :
        complaints.length === 0 ? <EmptyState icon="📢" title="No complaints" message="All clear! No complaints have been submitted." /> :
        <div className="space-y-3">
          {complaints.map(c => (
            <div key={c.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">{c.subject}</span>
                    <Badge status={c.complaintStatus} />
                  </div>
                  <div className="text-sm text-gray-400">By: {c.userName}</div>
                  {c.ownerName && <div className="text-sm text-gray-500">Against: {c.ownerName}</div>}
                  <p className="text-sm text-gray-300 mt-2 leading-relaxed">{c.message}</p>
                </div>
                <span className="text-xs text-gray-500 shrink-0">{formatDate(c.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      }
    </PageWrapper>
  )
}
export default AdminComplaints
