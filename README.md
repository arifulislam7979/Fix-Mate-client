# FixMate — Smart Device & Home Appliance Repair Service Platform

## Purpose
**FixMate** is a full-stack, role-based on-demand repair service booking platform built for **Customers**, **Technicians**, and **Admins**[cite: 8.2]. Its purpose is to connect users with verified technicians for device and home appliance repairs (such as smartphones, laptops, ACs, refrigerators, TVs, washing machines, and electrical work) with transparent job tracking and a pay-after-completion workflow via Stripe[cite: 8.2].

## Live URL
- **Client (Live App):** https://fix-mate-client-alpha.vercel.app/
- **Server (API):** (https://fix-mate-server.vercel.app/)

> Replace the placeholder URLs above with your deployed Vercel / production URLs before pushing to GitHub.

## Admin Credentials
- **Email:** `admin@gmail.com`[cite: 6]
- **Password:** `YOUR_ADMIN_PASSWORD` *(update with your actual seeded/configured admin password)*

## Key Features
- **Role-Based Access & Authentication:** Authentication powered by **BetterAuth** with MongoDB adapter, JWT verification, and role-based dashboards/routes for **Customer**, **Technician**, and **Admin** (`customer`, `technician`, `admin`)[cite: 7, 8.2].
- **Service Discovery & Moderation:** Technicians create and manage repair services (with images uploaded via **ImgBB**); Admins review and approve/reject listings before they go live, while service edits reset approval status to `pending` for re-moderation[cite: 8.2].
- **Repair Request & Job Status Pipeline:** Customers submit repair requests with contact details, address, preferred date, and issue description; jobs progress through `requested` → `accepted` → `in-progress` → `completed` (or `rejected` / `cancelled` according to role rules)[cite: 8.2].
- **Pay-After-Completion with Stripe:** Once a technician marks a job as `completed` and sets the final amount, customers can pay securely via **Stripe Checkout**, recording payment history and updating booking payment status to `paid`[cite: 8.2].
- **Admin & User Dashboards:** Dedicated views for managing users, services, bookings, transactions, and user profiles (`/dashboard/profile`)[cite: 6, 7, 8.2].

## NPM Packages Used

### Frontend (Next.js / React)
- `next` — React framework with App Router
- `react` & `react-dom` — UI rendering library
- `better-auth` — Authentication and session management
- `lucide-react` — Icon library (including UI and dashboard icons)
- `tailwindcss` — Utility-first CSS styling
- *(Add any additional frontend packages from your `package.json`, such as toast/alert or Stripe/chart libraries)*

### Backend (Node.js / Express)
- `express` — REST API server framework
- `mongodb` — MongoDB database driver
- `dotenv` — Environment variable management
- `cors` — Cross-Origin Resource Sharing configuration
- `stripe` — Payment checkout session and payment verification
- *(Add any additional server packages from your `server/package.json`)*

## Environment Variables Setup

### Client (`.env.local`)
- `NEXT_PUBLIC_API_URL` / backend API base URL
- `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_IMGBB_API_KEY` *(if used on client)*

### Server (`.env`)
- `PORT`
- `MONGODB_URI`
- `BETTER_AUTH_SECRET`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `IMGBB_API_KEY`
