import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { registerUser } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const UserRegister = () => {
  const [form, setForm] = useState({ name:'', email:'', password:'', mobileNumber:'', vehicleNumber:'' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await registerUser(form)
      const { token, ...userData } = res.data.data
      login(userData, token)
      toast.success('Account created successfully!')
      navigate('/user/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} className="glass rounded-2xl p-8 w-full max-w-md z-10 shadow-glass">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">P</div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join ParkZen and park smarter</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" placeholder="John Doe" icon={<FiUser />} value={form.name} onChange={set('name')} error={errors.name} />
          <Input label="Email" type="email" placeholder="you@email.com" icon={<FiMail />} value={form.email} onChange={set('email')} error={errors.email} />
          <Input label="Password" type="password" placeholder="Min 6 characters" icon={<FiLock />} value={form.password} onChange={set('password')} error={errors.password} />
          <Input label="Mobile Number (Optional)" placeholder="9876543210" icon={<FiPhone />} value={form.mobileNumber} onChange={set('mobileNumber')} />
          <Input label="Vehicle Number (Optional)" placeholder="MH12AB1234" value={form.vehicleNumber} onChange={set('vehicleNumber')} />
          <Button type="submit" loading={loading} className="w-full mt-2">Create Account</Button>
        </form>
        <div className="mt-5 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 text-center">
          <Link to="/owner/register" className="text-xs text-gray-500 hover:text-gray-300">Register as Parking Owner →</Link>
        </div>
      </motion.div>
    </div>
  )
}
export default UserRegister
