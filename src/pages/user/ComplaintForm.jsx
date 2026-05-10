import { useState, useEffect } from 'react'
import { addComplaint } from '../../api/userApi'
import api from '../../api/axios'
import PageWrapper from '../../components/common/PageWrapper'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import toast from 'react-hot-toast'

const ComplaintForm = () => {
  const [form, setForm] = useState({ ownerId:'', subject:'', message:'' })
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}))

  useEffect(() => {
    api.get('/admin/owners').then(r => setOwners(r.data.data || [])).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.ownerId) return toast.error('Select a parking owner')
    setLoading(true)
    try {
      await addComplaint({ ...form, ownerId: parseInt(form.ownerId) })
      toast.success('Complaint submitted successfully.')
      setForm({ ownerId:'', subject:'', message:'' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint')
    } finally { setLoading(false) }
  }

  return (
    <PageWrapper>
      <h1 className="page-title mb-6">Submit Complaint</h1>
      <div className="max-w-lg">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Parking Owner</label>
              <select className="input-field" value={form.ownerId} onChange={set('ownerId')} required>
                <option value="">Select owner...</option>
                {owners.map(o => <option key={o.id} value={o.id}>{o.name} — {o.parkingAreaName}</option>)}
              </select>
            </div>
            <Input label="Subject" placeholder="Brief subject of your complaint" value={form.subject} onChange={set('subject')} required />
            <div>
              <label className="label">Message</label>
              <textarea className="input-field min-h-32 resize-none" placeholder="Describe your complaint in detail..." value={form.message} onChange={set('message')} required />
            </div>
            <Button type="submit" loading={loading} className="w-full">Submit Complaint</Button>
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}
export default ComplaintForm
