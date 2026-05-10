# 🚗 ParkZen Frontend — Smart Parking System

Modern React 18 + Vite frontend for ParkZen Smart Parking System.

## Tech Stack
- React 18 + Vite
- Tailwind CSS (dark glassmorphism design)
- React Router DOM v6
- Axios (with JWT interceptors)
- Framer Motion (animations)
- Recharts (analytics charts)
- React Hot Toast (notifications)
- Razorpay Web SDK (payments)

## Setup

```bash
cd parkzen-frontend
npm install
cp .env.example .env   # fill in your values
npm run dev
```

## Environment Variables

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxxxxxx
```

## Build & Deploy

```bash
npm run build   # outputs to dist/
npm run preview # preview production build
```

Deploy `dist/` to Vercel, Netlify, or any static host.

## Default Credentials (from backend seed)

- **Admin:** admin@parkzen.com / admin@123
- **User:** Register via /register
- **Owner:** Register via /owner/register (needs admin approval)

## Project Structure

```
src/
├── api/          # Axios instance + API calls per role
├── context/      # AuthContext (JWT, user state)
├── pages/
│   ├── auth/     # Login/Register for all roles
│   ├── user/     # User dashboard, booking, payment, ticket
│   ├── owner/    # Owner dashboard, slots, analytics
│   ├── admin/    # Admin dashboard, users, owners, alerts
│   └── public/   # Home, About, Contact, 404
├── components/   # Reusable UI components
├── layouts/      # PublicLayout, UserLayout, OwnerLayout, AdminLayout
├── routes/       # ProtectedRoute + AppRoutes
└── utils/        # helpers, formatting
```
