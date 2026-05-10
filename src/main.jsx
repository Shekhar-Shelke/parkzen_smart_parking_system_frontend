import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background:'#1a1a2e', color:'#fff', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px' },
            success: { iconTheme:{ primary:'#10b981', secondary:'#fff' } },
            error: { iconTheme:{ primary:'#ef4444', secondary:'#fff' } },
            duration: 3500
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
