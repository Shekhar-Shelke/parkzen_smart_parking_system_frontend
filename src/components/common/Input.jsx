import { forwardRef, useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

const Input = forwardRef(({ label, error, icon, type='text', className='', ...props }, ref) => {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>}
        <input
          ref={ref}
          type={isPassword ? (show ? 'text' : 'password') : type}
          className={`input-field ${icon ? 'pl-10' : ''} ${isPassword ? 'pr-10' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
            {show ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  )
})
Input.displayName = 'Input'
export default Input
