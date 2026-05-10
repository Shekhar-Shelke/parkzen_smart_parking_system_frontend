import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi'
import { getOwnerDashboard, addSlot, deleteSlot, updateSlotStatus } from '../../api/ownerApi'
import api from '../../api/axios'
import PageWrapper from '../../components/common/PageWrapper'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'

const ManageSlots = () => {
  const [slots, setSlots] = useState([])
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ parkingAreaId:'', slotNumber:'', slotType:'CAR', chargingEnabled:false })
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}))

  const fetchSlots = () => {
    api.get('/owner/bookings').then(() => {}).catch(() => {})
    api.get('/owner/dashboard').then(r => {
      const data = r.data.data
      setAreas([])
    }).catch(() => {}).finally(() => setLoading(false))

    // Get slots via parking areas
    api.get('/admin/owners').then(async r => {
      const owner = r.data.data?.[0]
      if (owner?.id) {
        const areas = await api.get(`/admin/owners`)
        setAreas(areas.data.data?.filter(o => o.email === JSON.parse(localStorage.getItem('parkzen_user'))?.email) || [])
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { fetchSlots() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.parkingAreaId) return toast.error('Select parking area')
    setAdding(true)
    try {
      await addSlot({ ...form, parkingAreaId: parseInt(form.parkingAreaId) })
      toast.success('Slot added successfully')
      setShowAdd(false)
      setForm({ parkingAreaId:'', slotNumber:'', slotType:'CAR', chargingEnabled:false })
      fetchSlots()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add slot')
    } finally { setAdding(false) }
  }

  const handleDelete = async (slotId) => {
    if (!confirm('Delete this slot?')) return
    try {
      await deleteSlot(slotId)
      toast.success('Slot deleted')
      fetchSlots()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete') }
  }

  const handleStatusChange = async (slotId, status) => {
    try {
      await updateSlotStatus(slotId, status)
      toast.success('Status updated')
      fetchSlots()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update') }
  }

  return (
    <PageWrapper>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Manage Slots</h1>
        <Button onClick={() => setShowAdd(true)} icon={<FiPlus />}>Add Slot</Button>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader size="lg" /></div> :
        slots.length === 0 ? (
          <EmptyState icon="🅿️" title="No slots yet" message="Add your first parking slot to get started." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot, i) => (
              <motion.div key={slot.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.05 }} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-white text-xl">{slot.slotNumber}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{slot.slotType} • {slot.chargingEnabled ? '⚡ EV' : 'Standard'}</div>
                  </div>
                  <Badge status={slot.availabilityStatus} />
                </div>
                <select className="input-field text-sm py-2 mb-3" value={slot.availabilityStatus} onChange={e => handleStatusChange(slot.id, e.target.value)}>
                  <option value="AVAILABLE">Available</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="DISABLED">Disabled</option>
                </select>
                <button onClick={() => handleDelete(slot.id)} className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm transition-colors">
                  <FiTrash2 size={14} /> Delete
                </button>
              </motion.div>
            ))}
          </div>
        )
      }

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Parking Slot">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Parking Area</label>
            <select className="input-field" value={form.parkingAreaId} onChange={set('parkingAreaId')} required>
              <option value="">Select area...</option>
              {areas.map(a => <option key={a.id} value={a.id}>{a.parkingAreaName}</option>)}
            </select>
          </div>
          <Input label="Slot Number" placeholder="A-01" value={form.slotNumber} onChange={set('slotNumber')} required />
          <div>
            <label className="label">Slot Type</label>
            <select className="input-field" value={form.slotType} onChange={set('slotType')}>
              <option value="CAR">Car</option>
              <option value="BIKE">Bike</option>
              <option value="TRUCK">Truck</option>
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-emerald-500" checked={form.chargingEnabled}
              onChange={e => setForm(p => ({...p, chargingEnabled: e.target.checked}))} />
            <span className="text-white text-sm">EV Charging Enabled</span>
          </label>
          <Button type="submit" loading={adding} className="w-full">Add Slot</Button>
        </form>
      </Modal>
    </PageWrapper>
  )
}
export default ManageSlots
