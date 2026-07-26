# 🍽️ Gourmet Diner - High-Performance MERN Restaurant POS & Billing System

A fast, responsive, and production-ready Point of Sale (POS) & Billing web application built for restaurant counters. Designed using the **MERN Stack (MongoDB, Express.js, React 18, Node.js)** and **Tailwind CSS**, this system streamlines table management, quick order taking, instant invoice generation, and automated reporting.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb.svg)
![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20CSS-06b6d4.svg)
![Express](https://img.shields.io/badge/Backend-Express.js-000000.svg)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Mongoose-47a248.svg)

---

## 🌟 Key Features & Engineering Highlights

### 🪑 1. Multi-Table Isolated Cart Management
- **Concurrent Order Tracking:** Cashiers can maintain distinct, active carts across multiple tables (`T-1` to `T-8`, `Takeaway`, `Delivery`) simultaneously without state collisions or race conditions.
- **Visual Table Badging:** Live indicators highlight occupied tables with active orders versus vacant ones for real-time operational efficiency.

### 💳 2. Flexible Multi-Mode Payment & Dynamic QR
- **Dynamic UPI Payment Payload:** Automatically generates a client-side QR code using standard UPI deep-linking protocols (`upi://pay`), dynamically populated with the exact bill subtotal, taxes, and merchant parameters.
- **Razorpay Sandbox Integration:** Built-in online card payment processing with SDK event handlers and automatic payment verification.
- **Cash Transaction Lifecycle:** Automated single-tap cash checkout flow.

### 📊 3. Analytics, Reports & CSV Export
- **Sales Dashboard:** Real-time summary metrics for total revenue, daily order volume, and payment channel breakdown (Cash vs. UPI vs. Card).
- **One-Click CSV Export:** Client-side CSV generation allowing restaurant managers to download transaction histories for accounting and auditing.

### 🖨️ 4. Thermal Receipt Printing Engine
- Dedicated POS invoice overlay formatted precisely for **80mm thermal receipt printers**.
- Clean `@media print` CSS directives hide browser chrome and background interfaces during printing.

### 🍱 5. Real-Time Menu Management (CRUD)
- In-app modal to add new dishes and categories directly to MongoDB without database intervention.
- Instant search bar and category filter pill UI for fast item navigation.

---

## 🛠️ Tech Stack & Dependencies

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS, Lucide Icons
- **HTTP Client:** Axios
- **QR Engine:** `qrcode.react`

### Backend
- **Runtime:** Node.js (Express.js REST API)
- **Database:** MongoDB & Mongoose ODM
- **Payment Gateway:** Razorpay Node SDK
- **Utilities:** `dotenv`, `cors`, `nodemon`

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI.

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env


restaurant-billing/
├── backend/
│   ├── config/
│   │   └── db.js            # MongoDB Connection Logic
│   ├── models/
│   │   ├── MenuItem.js      # Menu Schema
│   │   └── Order.js         # Order & Transaction Schema
│   ├── routes/
│   │   └── billingRoutes.js # REST Endpoints & Razorpay Order API
│   ├── seed.js              # Database Seeder Script
│   ├── server.js            # Node Express Application Entrypoint
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AddMenuItemModal.jsx  # Menu Creation Modal
    │   │   ├── CartPanel.jsx         # Billing Sidebar & Calculations
    │   │   ├── MenuGrid.jsx          # Catalog Search & Filter Grid
    │   │   ├── PrintableReceipt.jsx  # 80mm Thermal Receipt Layout
    │   │   ├── ReportModal.jsx       # Analytics & CSV Exporter
    │   │   └── TableSelector.jsx     # Multi-Table Control Bar
    │   ├── App.jsx                   # Global POS State Manager
    │   ├── index.css                 # Tailwind & Thermal Print CSS
    │   └── main.jsx
    ├── index.html                    # HTML Shell & Razorpay SDK
    └── package.json

Configure your .env file:
------------------------

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/restaurant_pos
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret