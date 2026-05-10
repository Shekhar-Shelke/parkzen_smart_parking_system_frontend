import { Link } from 'react-router-dom'
const Footer = () => (
  <footer className="border-t border-white/10 bg-dark-800 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">P</div>
            <span className="text-lg font-bold gradient-text">ParkZen</span>
          </div>
          <p className="text-gray-500 text-sm">Smart parking for the modern world. Find, book, and park effortlessly.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Account</h4>
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <Link to="/login" className="hover:text-white transition-colors">User Login</Link>
            <Link to="/owner/login" className="hover:text-white transition-colors">Owner Login</Link>
            <Link to="/admin/login" className="hover:text-white transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 pt-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} ParkZen. All rights reserved.
      </div>
    </div>
  </footer>
)
export default Footer
