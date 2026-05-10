import { useEffect, useState } from 'react'
import { FiStar } from 'react-icons/fi'
import { getOwnerReviews } from '../../api/ownerApi'
import PageWrapper from '../../components/common/PageWrapper'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const OwnerReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOwnerReviews().then(r => setReviews(r.data.data || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))
  }, [])

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Reviews & Feedback</h1>
        {reviews.length > 0 && (
          <div className="card py-2 px-4 flex items-center gap-2">
            <FiStar className="text-yellow-400 fill-current" />
            <span className="font-bold text-white">{avg}</span>
            <span className="text-gray-400 text-sm">({reviews.length})</span>
          </div>
        )}
      </div>
      {loading ? <div className="flex justify-center py-20"><Loader size="lg" /></div> :
        reviews.length === 0 ? <EmptyState icon="⭐" title="No reviews yet" message="Reviews from your customers will appear here." /> :
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-white">{r.userName}</div>
                  <div className="flex gap-0.5 mt-1">
                    {[1,2,3,4,5].map(s => <FiStar key={s} size={14} className={s <= r.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'} />)}
                  </div>
                </div>
                <span className="text-xs text-gray-500">{formatDate(r.createdAt)}</span>
              </div>
              {r.comment && <p className="text-gray-300 text-sm mt-3 leading-relaxed">"{r.comment}"</p>}
            </div>
          ))}
        </div>
      }
    </PageWrapper>
  )
}
export default OwnerReviews
