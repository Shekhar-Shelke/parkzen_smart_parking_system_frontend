import api from './axios'
export const loginUser = (data) => api.post('/auth/user/login', data)
export const registerUser = (data) => api.post('/auth/user/register', data)
export const loginOwner = (data) => api.post('/auth/owner/login', data)
export const registerOwner = (data) => api.post('/auth/owner/register', data)
export const loginAdmin = (data) => api.post('/auth/admin/login', data)
