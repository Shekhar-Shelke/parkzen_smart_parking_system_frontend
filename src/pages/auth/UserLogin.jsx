import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { loginUser } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const UserLogin = () => {
  const [form, setForm] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await loginUser(form)
      const { token, ...userData } = res.data.data
      login(userData, token)
      toast.success(`Welcome back, ${userData.name}!`)
      navigate('/user/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} className="glass rounded-2xl p-8 w-full max-w-md z-10 shadow-glass">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">P</div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your ParkZen account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" placeholder="you@email.com" icon={<FiMail />}
            value={form.email} onChange={e => setForm(p => ({...p, email:e.target.value}))} error={errors.email} />
          <Input label="Password" type="password" placeholder="••••••••" icon={<FiLock />}
            value={form.password} onChange={e => setForm(p => ({...p, password:e.target.value}))} error={errors.password} />
          <Button type="submit" loading={loading} className="w-full mt-2">Sign In</Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">Sign up</Link>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2 text-center">
          <Link to="/owner/login" className="text-xs text-gray-500 hover:text-gray-300">Login as Owner →</Link>
          <Link to="/admin/login" className="text-xs text-gray-500 hover:text-gray-300">Login as Admin →</Link>
        </div>
      </motion.div>
    </div>
  )
}
export default UserLogin
