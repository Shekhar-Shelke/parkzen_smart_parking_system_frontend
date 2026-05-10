import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const ContactPage = () => {
  const [form, setForm] = useState({ name:'', email:'', message:'' })
  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Message sent! We\'ll reply within 24 hours.')
    setForm({ name:'', email:'', message:'' })
  }
  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="text-center mb-10">
        <h1 className="text-4xl font-black text-white mb-3">Contact <span className="gradient-text">Us</span></h1>
        <p className="text-gray-400">Have questions? We'd love to hear from you.</p>
      </motion.div>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }} className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" placeholder="Your name" value={form.name} onChange={e => setForm(p => ({...p, name:e.target.value}))} required />
          <Input label="Email" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm(p => ({...p, email:e.target.value}))} required />
          <div>
            <label className="label">Message</label>
            <textarea className="input-field min-h-32 resize-none" placeholder="Your message..." value={form.message} onChange={e => setForm(p => ({...p, message:e.target.value}))} required />
          </div>
          <Button type="submit" className="w-full">Send Message</Button>
        </form>
      </motion.div>
    </div>
  )
}
export default ContactPage
