import { useState } from 'react'
import { motion } from 'framer-motion'
import { sendFireAlert, sendParkingFullAlert } from '../../api/adminApi'
import PageWrapper from '../../components/common/PageWrapper'
import Button from '../../components/common/Button'
import toast from 'react-hot-toast'

const AlertCard = ({ icon, title, desc, color, onSend, loading }) => (
  <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className={`card border-${color}-500/30 bg-gradient-to-br from-${color}-500/10 to-transparent`}>
    <div className="text-5xl mb-4">{icon}</div>
    <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
    <p className="text-gray-400 text-sm mb-6 leading-relaxed">{desc}</p>
    <Button onClick={onSend} loading={loading} className={`w-full bg-${color}-600 hover:bg-${color}-500`}>{icon} Send Alert</Button>
  </motion.div>
)

const AlertsPage = () => {
  const [fireForm, setFireForm] = useState({ title:'🔥 FIRE ALERT', message:'' })
  const [parkingForm, setParkingForm] = useState({ title:'🚗 Parking Full Alert', message:'' })
  const [sendingFire, setSendingFire] = useState(false)
  const [sendingParking, setSendingParking] = useState(false)

  const handleFireAlert = async () => {
    if (!fireForm.message) return toast.error('Enter alert message')
    setSendingFire(true)
    try { await sendFireAlert(fireForm); toast.success('Fire alert sent to all users!') }
    catch { toast.error('Failed to send alert') } finally { setSendingFire(false) }
  }

  const handleParkingAlert = async () => {
    if (!parkingForm.message) return toast.error('Enter alert message')
    setSendingParking(true)
    try { await sendParkingFullAlert(parkingForm); toast.success('Parking full alert sent!') }
    catch { toast.error('Failed to send alert') } finally { setSendingParking(false) }
  }

  return (
    <PageWrapper>
      <h1 className="page-title mb-2">Alert Center</h1>
      <p className="text-gray-500 text-sm mb-6">Broadcast emergency alerts to all users instantly</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
          <div className="text-5xl mb-4">🔥</div>
          <h2 className="text-xl font-bold text-white mb-2">Fire Alert</h2>
          <p className="text-gray-400 text-sm mb-4">Broadcast an emergency fire alert to all registered users immediately.</p>
          <div className="space-y-3">
            <input className="input-field text-sm" value={fireForm.title} onChange={e => setFireForm(p => ({...p, title: e.target.value}))} placeholder="Alert title" />
            <textarea className="input-field min-h-24 resize-none text-sm" value={fireForm.message} onChange={e => setFireForm(p => ({...p, message: e.target.value}))} placeholder="Describe the emergency location and instructions..." />
            <button onClick={handleFireAlert} disabled={sendingFire} className="btn-danger w-full">{sendingFire ? 'Sending...' : '🔥 Send Fire Alert'}</button>
          </div>
        </div>

        <div className="card border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-transparent">
          <div className="text-5xl mb-4">🚗</div>
          <h2 className="text-xl font-bold text-white mb-2">Parking Full Alert</h2>
          <p className="text-gray-400 text-sm mb-4">Notify users that a parking area is at full capacity.</p>
          <div className="space-y-3">
            <input className="input-field text-sm" value={parkingForm.title} onChange={e => setParkingForm(p => ({...p, title: e.target.value}))} placeholder="Alert title" />
            <textarea className="input-field min-h-24 resize-none text-sm" value={parkingForm.message} onChange={e => setParkingForm(p => ({...p, message: e.target.value}))} placeholder="Specify which parking area is full and alternatives..." />
            <button onClick={handleParkingAlert} disabled={sendingParking} className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-xl transition-all w-full">{sendingParking ? 'Sending...' : '🚗 Send Parking Alert'}</button>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
export default AlertsPage
