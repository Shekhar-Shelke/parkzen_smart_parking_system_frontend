import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMapPin, FiCheck, FiX, FiUser, FiMail, FiClock, FiMap } from 'react-icons/fi'
import { getAllOwners, approveOwner, rejectOwner } from '../../api/adminApi'
import PageWrapper from '../../components/common/PageWrapper'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import { formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const OwnerCard = ({ owner, onApprove, onReject, processing }) => {
  const mapUrl = `https://www.openstreetmap.org/?mlat=${owner.latitude}&mlon=${owner.longitude}#map=16/${owner.latitude}/${owner.longitude}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      layout
      className={`card border transition-all duration-300 ${
        owner.approved
          ? 'border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent'
          : 'border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-transparent'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            {owner.name?.[0]?.toUpperCase()}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-bold text-white text-base">{owner.name}</h3>
              <p className="text-primary-400 text-sm font-medium">{owner.parkingAreaName}</p>
            </div>
            <span className={`badge shrink-0 ${owner.approved ? 'badge-success' : 'badge-warning'}`}>
              {owner.approved ? '✅ Approved' : '⏳ Pending'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-400 mb-3">
            <div className="flex items-center gap-1.5"><FiMail size={11} className="text-gray-500" />{owner.email}</div>
            <div className="flex items-center gap-1.5"><FiClock size={11} className="text-gray-500" />Joined {formatDate(owner.createdAt)}</div>
            {owner.address && (
              <div className="flex items-center gap-1.5 sm:col-span-2 truncate">
                <FiMapPin size={11} className="text-gray-500 shrink-0" />
                <span className="truncate">{owner.address}</span>
              </div>
            )}
          </div>

          {/* Location coordinates + map link */}
          {owner.latitude && owner.longitude && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-dark-700/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono">
                <FiMap size={11} className="text-primary-400" />
                <span className="text-gray-300">{parseFloat(owner.latitude).toFixed(4)}, {parseFloat(owner.longitude).toFixed(4)}</span>
              </div>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors underline underline-offset-2"
              >
                <FiMapPin size={11} /> View on map
              </a>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            {!owner.approved && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => onApprove(owner.id)}
                disabled={processing[owner.id]}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
              >
                {processing[owner.id] ? (
                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiCheck size={13} />
                )}
                Approve Owner
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onReject(owner.id)}
              disabled={processing[owner.id]}
              className="flex items-center gap-1.5 bg-red-600/80 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
            >
              {processing[owner.id] ? (
                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FiX size={13} />
              )}
              {owner.approved ? 'Revoke' : 'Reject'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const ManageOwners = () => {
  const [owners, setOwners] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState({})
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')

  const fetch = () => {
    setLoading(true)
    getAllOwners()
      .then(r => setOwners(r.data.data || []))
      .catch(() => toast.error('Failed to load owners'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetch() }, [])

  const handle = async (id, action) => {
    setProcessing(p => ({ ...p, [id]: true }))
    try {
      if (action === 'approve') {
        await approveOwner(id)
        toast.success('Owner approved! They can now login and manage parking slots.')
      } else {
        await rejectOwner(id)
        toast('Owner rejected.', { icon: '⚠️' })
      }
      fetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    } finally {
      setProcessing(p => ({ ...p, [id]: false }))
    }
  }

  const pending = owners.filter(o => !o.approved)
  const approved = owners.filter(o => o.approved)

  const displayed = (tab === 'pending' ? pending : tab === 'approved' ? approved : owners)
    .filter(o =>
      !search ||
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.parkingAreaName?.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-6">
        <h1 className="page-title">Manage Owners</h1>
        <p className="text-gray-500 text-sm mt-0.5">Review registrations and approve parking owners</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label:'Total', count: owners.length, color:'text-white', bg:'bg-dark-700/50 border-white/10' },
          { label:'Pending', count: pending.length, color:'text-yellow-400', bg:'bg-yellow-500/10 border-yellow-500/20' },
          { label:'Approved', count: approved.length, color:'text-emerald-400', bg:'bg-emerald-500/10 border-emerald-500/20' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border rounded-xl p-3 text-center`}>
            <div className={`text-xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-2">
          {[['all','All'],['pending','Pending'],['approved','Approved']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                tab === val
                  ? 'bg-primary-600 border-primary-500 text-white'
                  : 'border-white/10 text-gray-400 hover:border-white/30'
              }`}>
              {label} {val === 'pending' && pending.length > 0 && (
                <span className="ml-1 bg-yellow-500 text-black text-xs rounded-full px-1.5 py-0.5 font-bold">{pending.length}</span>
              )}
            </button>
          ))}
        </div>
        <input
          className="input-field py-2 text-sm flex-1"
          placeholder="Search by name, email, parking area…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Pending approval banner */}
      <AnimatePresence>
        {pending.length > 0 && tab !== 'approved' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 mb-5 flex items-center gap-3"
          >
            <span className="text-xl">⏳</span>
            <p className="text-yellow-300 text-sm font-medium">
              {pending.length} owner{pending.length > 1 ? 's' : ''} waiting for your approval.
              Review their location and details below before approving.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader size="lg" /></div>
      ) : displayed.length === 0 ? (
        <EmptyState icon="🏢" title="No owners found" message={tab === 'pending' ? 'No pending approvals right now.' : 'No owners match your filter.'} />
      ) : (
        <motion.div layout className="space-y-4">
          <AnimatePresence>
            {displayed.map(o => (
              <OwnerCard
                key={o.id}
                owner={o}
                onApprove={(id) => handle(id, 'approve')}
                onReject={(id) => handle(id, 'reject')}
                processing={processing}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </PageWrapper>
  )
}

export default ManageOwners
