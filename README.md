# Admission Anytime - Premium MBBS Admission Platform

A premium, fully responsive, and highly interactive landing page designed for **Admission Anytime** to guide students seeking MBBS admissions in India and Abroad (Georgia, Russia, Kazakhstan, Uzbekistan, Kyrgyzstan, Nepal, and China).

---

## 🌟 Key Features

- **Pixel-Perfect Header & Hero:** Sleek dark blue branding theme with integrated quick-contact scheduler, customizable dynamic brand logo, and responsive navigation dropdowns.
- **Integrated First-Screen Stats:** High-visibility circular gold badges showcasing key highlights (25+ Years Experience, 25,000+ Students Guided, 500+ Medical Colleges) attached to the hero bottom viewport.
- **Dynamic Counseling Form:** Validated multi-step inquiry form connected to a backend MongoDB database for real-time lead capture.
- **India vs Abroad Comparison:** Fully interactive tabbed layout showing top Indian government/private/deemed colleges alongside circular flag card configurations for 7 popular foreign countries.
- **University Carousel:** A clean slider displaying popular universities abroad with styled logo badges.
- **Admission Process & Services:** 7-step colored timeline indicator with connecting arrows and a grid of 13 custom outline service cards featuring zoom hover micro-animations.
- **Testimonial Slider:** Reviews section for parents and students with verified gold ratings and smooth slide controls.
- **Floating WhatsApp Assistance:** Interactive floating badge for instant support.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js (App Router)
- **Library:** React, Framer Motion (for page animations)
- **Styling:** Tailwind CSS (Vanilla utilities)
- **Icons:** React Icons (`fa` suite)

### Backend
- **Runtime:** Node.js (Express.js framework)
- **Database:** MongoDB
- **Mailer:** nodemailer (for lead notification triggers)

---

## 🚀 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/erRahulSingh/Admission-Anytime.git
cd Admission-Anytime
```

### 2. Run the Backend
```bash
cd backend
# Install dependencies
npm install

# Configure your environment variables in backend/.env
# Example variables: PORT=5000, MONGO_URI=your_mongodb_connection_string

# Start server (runs on port 5000 by default)
npm start
```

### 3. Run the Frontend
```bash
cd ../frontend
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📄 License
This project is private and proprietary. All rights reserved.
