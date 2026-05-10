import { useState, useEffect } from 'react'
import { FiStar } from 'react-icons/fi'
import { addReview } from '../../api/userApi'
import { getOwnerDashboard } from '../../api/ownerApi'
import api from '../../api/axios'
import PageWrapper from '../../components/common/PageWrapper'
import Button from '../../components/common/Button'
import toast from 'react-hot-toast'

const FeedbackForm = () => {
  const [form, setForm] = useState({ ownerId:'', rating:5, comment:'' })
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(false)
  const [hover, setHover] = useState(0)

  useEffect(() => {
    api.get('/admin/owners').then(r => setOwners(r.data.data || [])).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.ownerId) return toast.error('Select a parking owner')
    setLoading(true)
    try {
      await addReview({ ...form, ownerId: parseInt(form.ownerId) })
      toast.success('Review submitted! Thank you.')
      setForm({ ownerId:'', rating:5, comment:'' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally { setLoading(false) }
  }

  return (
    <PageWrapper>
      <h1 className="page-title mb-6">Submit Feedback</h1>
      <div className="max-w-lg">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Select Parking Owner</label>
              <select className="input-field" value={form.ownerId} onChange={e => setForm(p => ({...p, ownerId: e.target.value}))} required>
                <option value="">Choose owner...</option>
                {owners.map(o => <option key={o.id} value={o.id}>{o.name} — {o.parkingAreaName}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Rating</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button"
                    onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)}
                    onClick={() => setForm(p => ({...p, rating: star}))}
                    className={`text-3xl transition-transform hover:scale-110 ${star <= (hover || form.rating) ? 'text-yellow-400' : 'text-gray-600'}`}>
                    <FiStar className={star <= (hover || form.rating) ? 'fill-current' : ''} />
                  </button>
                ))}
                <span className="text-gray-400 self-center ml-2 text-sm">{form.rating}/5</span>
              </div>
            </div>
            <div>
              <label className="label">Comment (Optional)</label>
              <textarea className="input-field min-h-28 resize-none" placeholder="Share your experience..." value={form.comment} onChange={e => setForm(p => ({...p, comment: e.target.value}))} />
            </div>
            <Button type="submit" loading={loading} className="w-full">Submit Review</Button>
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}
export default FeedbackForm
