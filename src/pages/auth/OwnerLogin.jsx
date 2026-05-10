import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { loginOwner } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const OwnerLogin = () => {
  const [form, setForm] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await loginOwner(form)
      const { token, ...userData } = res.data.data
      login(userData, token)
      toast.success('Welcome back!')
      navigate('/owner/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} className="glass rounded-2xl p-8 w-full max-w-md z-10 shadow-glass">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">🏢</div>
          <h1 className="text-2xl font-bold text-white">Owner Login</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your parking business</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" placeholder="owner@email.com" icon={<FiMail />}
            value={form.email} onChange={e => setForm(p => ({...p, email:e.target.value}))} />
          <Input label="Password" type="password" placeholder="••••••••" icon={<FiLock />}
            value={form.password} onChange={e => setForm(p => ({...p, password:e.target.value}))} />
          <Button type="submit" loading={loading} className="w-full">Sign In as Owner</Button>
        </form>
        <div className="mt-5 text-center text-sm text-gray-500">
          No owner account? <Link to="/owner/register" className="text-primary-400 hover:text-primary-300 font-medium">Register</Link>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 text-center">
          <Link to="/login" className="text-xs text-gray-500 hover:text-gray-300">← Back to User Login</Link>
        </div>
      </motion.div>
    </div>
  )
}
export default OwnerLogin
