import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiShield } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { loginAdmin } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const AdminLogin = () => {
  const [form, setForm] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await loginAdmin(form)
      const { token, ...userData } = res.data.data
      login(userData, token)
      toast.success('Admin access granted!')
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Access denied')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} className="glass rounded-2xl p-8 w-full max-w-sm z-10 shadow-glass">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
            <FiShield size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-gray-500 text-sm mt-1">Authorized personnel only</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Admin Email" type="email" placeholder="admin@parkzen.com" icon={<FiMail />}
            value={form.email} onChange={e => setForm(p => ({...p, email:e.target.value}))} />
          <Input label="Password" type="password" placeholder="••••••••" icon={<FiLock />}
            value={form.password} onChange={e => setForm(p => ({...p, password:e.target.value}))} />
          <Button type="submit" loading={loading} className="w-full bg-red-600 hover:bg-red-500">
            Access Admin Panel
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
export default AdminLogin
