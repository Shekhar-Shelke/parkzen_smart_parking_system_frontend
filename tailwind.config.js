/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a',950:'#172554' },
        dark: { 900:'#0a0a0f',800:'#0f0f1a',700:'#13131f',600:'#1a1a2e',500:'#16213e',400:'#1f2547',300:'#2a2d4a' },
        accent: { 400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed' },
        neon: { blue:'#00d4ff',purple:'#7c3aed',green:'#00ff88',pink:'#ff006e' }
      },
      fontFamily: { sans: ['Inter','system-ui','sans-serif'] },
      boxShadow: {
        'glow-blue':'0 0 20px rgba(59,130,246,0.3)',
        'glow-purple':'0 0 20px rgba(139,92,246,0.3)',
        'card':'0 4px 24px rgba(0,0,0,0.4)',
        'glass':'0 8px 32px rgba(0,0,0,0.3)'
      },
      backdropBlur: { xs:'2px' },
      animation: {
        'fade-in':'fadeIn 0.5s ease-in-out',
        'slide-up':'slideUp 0.4s ease-out',
        'pulse-slow':'pulse 3s infinite',
        'float':'float 3s ease-in-out infinite'
      },
      keyframes: {
        fadeIn:{'0%':{opacity:'0'},'100%':{opacity:'1'}},
        slideUp:{'0%':{transform:'translateY(20px)',opacity:'0'},'100%':{transform:'translateY(0)',opacity:'1'}},
        float:{'0%,100%':{transform:'translateY(0)'},'50%':{transform:'translateY(-10px)'}}
      }
    },
  },
  plugins: [],
}
