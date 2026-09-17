# 🌿 Habit Tracker Web App

A high-performance, modern habit tracking application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Firebase (Auth & Cloud Firestore)**. Designed with a dark midnight teal aesthetic, fluid micro-interactions, custom status pills, an interactive monthly checkbox matrix, and a comprehensive yearly analytics dashboard.

---

## ✨ Features

- **🔐 Authentication & User Profiles:**
  - Firebase Authentication (Email/Password & Google Sign-In ready).
  - Built-in **Demo Mode** with instant one-click login and local storage persistence.
  - User streak counters and profile indicators.

- **📅 Today & Daily Check-In View:**
  - **Dynamic Week Strip (`S M T W T F S`):** Visual calendar pills with completion dots.
  - **Daily Activity & Mood Tracker:** Interactive pills (`High energy`, `Mindful`, `Sport`, `Stayed in`, `Rainy`, etc.).
  - **Habit Checklist:** One-tap habit check-in, streak counter (`🔥 7d`), and celebratory confetti bursts on completion.
  - **Circular Progress Ring:** Live tracking of daily completion percentage.

- **🗓️ Monthly Matrix View:**
  - Interactive grid: Habits on rows, all days of the month (1–31) on columns.
  - Checkboxes for every single day: check off today or retroactively check past days with instant cloud/local synchronization.
  - Monthly completion percentages and check-in counters.
  - Category filters (Fitness, Productivity, Health, Learning, Mindfulness).

- **📊 Yearly Analytics Dashboard:**
  - **365-Day Consistency Heatmap:** Visual intensity grid (GitHub/Apple Health style) showing yearly completion density.
  - **12-Month Performance Bars:** Completion breakdown across all 12 months.
  - **Focus Area Donut Ring:** Category balance and distribution.
  - **Key Metrics:** Annual completions, consistency score, best streak, and active habits.

- **➕ Add & Manage Habits:**
  - Custom habit naming and target notes.
  - Category and color accent selector (Neon Lime, Mint Teal, Sky Blue, Warm Peach, Lavender, Rose).
  - 20+ Lucide icon choices.

- **⚡ API Layer:**
  - Next.js Route Handlers (`/api/habits`, `/api/stats`).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Connecting Firebase (Optional)

The app works instantly out-of-the-box in **Demo Mode** with offline storage. To connect your live Firebase project:

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Add your Firebase Web App credentials from the [Firebase Console](https://console.firebase.google.com/):
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
3. Restart `npm run dev`. Your habits and check-in logs will now sync to Cloud Firestore in real time.

---

## 🌐 Deploy to Firebase

To deploy to Firebase Hosting:
```bash
npm run build
npx firebase deploy --only hosting
```
