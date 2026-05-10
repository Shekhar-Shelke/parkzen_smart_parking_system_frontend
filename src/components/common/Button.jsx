import { motion } from 'framer-motion'
import Loader from './Loader'

const Button = ({ children, variant='primary', loading=false, icon, className='', ...props }) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    success: 'btn-success',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all font-medium'
  }
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${variants[variant]} flex items-center justify-center gap-2 ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader size="sm" /> : icon && <span>{icon}</span>}
      {children}
    </motion.button>
  )
}
export default Button
