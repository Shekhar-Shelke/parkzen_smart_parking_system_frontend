import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'

const Modal = ({ isOpen, onClose, title, children, size='md' }) => {
  const sizes = { sm:'max-w-sm', md:'max-w-md', lg:'max-w-lg', xl:'max-w-2xl' }
  if (!isOpen) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        exit={{ opacity:0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale:0.9, opacity:0 }}
          animate={{ scale:1, opacity:1 }}
          exit={{ scale:0.9, opacity:0 }}
          className={`glass-dark rounded-2xl w-full ${sizes[size]} shadow-glass`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
              <FiX size={20} />
            </button>
          </div>
          <div className="p-5">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
export default Modal
