import { useEffect, useState } from 'react'
import { getAllMessages, getAllOwners, sendMessageToOwner } from '../../api/adminApi'
import PageWrapper from '../../components/common/PageWrapper'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import { formatDateTime } from '../../utils/helpers'
import toast from 'react-hot-toast'

const AdminMessages = () => {
  const [messages, setMessages] = useState([])
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ receiverId:'', message:'' })

  const fetch = () => {
    Promise.all([getAllMessages(), getAllOwners()])
      .then(([m, o]) => { setMessages(m.data.data || []); setOwners(o.data.data || []) })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { fetch() }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!form.receiverId || !form.message) return toast.error('Fill all fields')
    setSending(true)
    try {
      await sendMessageToOwner({ receiverId: parseInt(form.receiverId), message: form.message })
      toast.success('Message sent!')
      setShowModal(false)
      setForm({ receiverId:'', message:'' })
      fetch()
    } catch { toast.error('Failed to send') } finally { setSending(false) }
  }

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Messages</h1>
        <Button onClick={() => setShowModal(true)}>✉️ Send Message</Button>
      </div>
      {loading ? <div className="flex justify-center py-20"><Loader size="lg" /></div> :
        messages.length === 0 ? <EmptyState icon="✉️" title="No messages" /> :
        <div className="space-y-3">
          {messages.map(m => (
            <div key={m.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-info">{m.senderRole?.replace('ROLE_','')}</span>
                    <span className="text-gray-400 text-sm">→</span>
                    <span className="badge badge-info">{m.receiverRole?.replace('ROLE_','')}</span>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">{m.message}</p>
                </div>
                <span className="text-xs text-gray-500 shrink-0">{formatDateTime(m.sentAt)}</span>
              </div>
            </div>
          ))}
        </div>
      }
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Send Message to Owner">
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="label">Select Owner</label>
            <select className="input-field" value={form.receiverId} onChange={e => setForm(p => ({...p, receiverId: e.target.value}))} required>
              <option value="">Choose owner...</option>
              {owners.map(o => <option key={o.id} value={o.id}>{o.name} — {o.email}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Message</label>
            <textarea className="input-field min-h-28 resize-none" placeholder="Type your message..." value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} required />
          </div>
          <Button type="submit" loading={sending} className="w-full">Send Message</Button>
        </form>
      </Modal>
    </PageWrapper>
  )
}
export default AdminMessages
