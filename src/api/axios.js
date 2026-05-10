import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('parkzen_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('parkzen_token')
      localStorage.removeItem('parkzen_user')
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        toast.error('Session expired. Please login again.')
        setTimeout(() => { window.location.href = '/' }, 1500)
      }
    } else if (error.response?.status === 403) {
      toast.error('Access denied.')
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again.')
    }
    return Promise.reject(error)
  }
)

export default api
