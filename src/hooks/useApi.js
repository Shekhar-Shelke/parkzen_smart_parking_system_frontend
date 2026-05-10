import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

const useApi = (apiFunc, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFunc(...args)
      const result = res.data?.data ?? res.data
      setData(result)
      if (options.onSuccess) options.onSuccess(result)
      if (options.successMsg) toast.success(options.successMsg)
      return result
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong'
      setError(msg)
      if (options.onError) options.onError(err)
      if (options.errorMsg !== false) toast.error(options.errorMsg || msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunc])

  return { data, loading, error, execute }
}
export default useApi
