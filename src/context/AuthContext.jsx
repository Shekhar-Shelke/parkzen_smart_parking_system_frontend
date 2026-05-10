import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('parkzen_token')
    const storedUser = localStorage.getItem('parkzen_user')
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch { logout() }
    }
    setLoading(false)
  }, [])

  const login = useCallback((userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('parkzen_token', authToken)
    localStorage.setItem('parkzen_user', JSON.stringify(userData))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('parkzen_token')
    localStorage.removeItem('parkzen_user')
    toast.success('Logged out successfully')
  }, [])

  const isAuthenticated = !!token && !!user
  const role = user?.role || null

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, role, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
