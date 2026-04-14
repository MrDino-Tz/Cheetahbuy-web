# 🐆 CheetahBuy Web Portal

A modern, full-featured web portal for the **CheetahBuy** delivery platform — built for Admins and Vendors to manage their operations in real time.

---

## 📌 Overview

CheetahBuy Web is the browser-based management interface for the CheetahBuy delivery ecosystem. It provides two role-based dashboards:

- **Admin Portal** — Full platform control: manage vendors, customers, orders, categories, promotions, analytics, and system settings.
- **Vendor Portal** — Vendor-facing dashboard: manage products, track orders, view sales analytics, and update store settings.

The web portal integrates directly with **Supabase** (database & auth) and **Cloudinary** (media/image storage), matching the backend used by the CheetahBuy Android app.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite 8](https://vitejs.dev/) | Build tool & dev server |
| [React Router v7](https://reactrouter.com/) | Client-side routing |
| [Supabase](https://supabase.com/) | Backend: database, auth, real-time |
| [Cloudinary](https://cloudinary.com/) | Image & media storage |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Recharts](https://recharts.org/) | Charts & analytics graphs |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Radix UI](https://www.radix-ui.com/) | Accessible UI primitives |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |

---

## 📁 Project Structure

```
cheetahbuy-web/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images and SVGs
│   ├── components/          # Shared components
│   │   └── ui/              # Reusable UI primitives
│   ├── lib/                 # Utility & service files
│   │   ├── supabase.ts      # Supabase client
│   │   ├── cloudinary.ts    # Cloudinary config
│   │   └── utils.ts         # Helper functions
│   ├── pages/
│   │   ├── admin/           # Admin dashboard pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Vendors.tsx
│   │   │   ├── Customers.tsx
│   │   │   ├── Orders.tsx
│   │   │   ├── Categories.tsx
│   │   │   ├── Promos.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── Settings.tsx
│   │   └── vendor/          # Vendor dashboard pages
│   │       ├── Dashboard.tsx
│   │       ├── Products.tsx
│   │       ├── Orders.tsx
│   │       └── Analytics.tsx
│   ├── App.tsx              # Root app & routing
│   └── main.tsx             # Entry point
├── .env.example             # Environment variable template
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher
- A [Supabase](https://supabase.com/) project
- A [Cloudinary](https://cloudinary.com/) account

### 1. Clone the repository

```bash
git clone https://github.com/MrDino-Tz/cheetahbuy-web.git
cd cheetahbuy-web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key

VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_API_KEY=your-api-key
VITE_CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Run the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 🔐 Authentication & Roles

Authentication is handled via **Supabase Auth**. After login, users are redirected based on their role:

- `admin` → `/admin/dashboard`
- `vendor` → `/vendor/dashboard`

Protected routes are guarded by the `ProtectedRoute` component.

---

## 📱 Related

- **CheetahBuy Android App** — [MrDino-Tz/CheetahBuyApp](https://github.com/MrDino-Tz/CheetahBuyApp) — the customer & rider mobile application.

---

## 📄 License

This project is private and proprietary to CheetahBuy. All rights reserved.
