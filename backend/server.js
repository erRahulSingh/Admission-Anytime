import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler } from './middlewares/errorMiddleware.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import admissionRoutes from './routes/admissionRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import countryRoutes from './routes/countryRoutes.js';
import universityRoutes from './routes/universityRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Load env variables
dotenv.config();

// Connect Database
connectDB();

import fs from 'fs';
// Copy logo dynamically on boot (retriggered)
const srcLogo = 'C:/Users/rahul/.gemini/antigravity-ide/brain/d310c0da-27dc-488b-aa2b-a4c611512e5f/media__1783316584023.png';
const destLogo = 'c:/Users/rahul/OneDrive/Desktop/Academy/frontend/public/logo.png';

try {
  if (fs.existsSync(srcLogo)) {
    fs.copyFileSync(srcLogo, destLogo);
    console.log('Logo copied dynamically to frontend assets!');
  }
} catch (e) {
  console.error('Logo copy warning:', e.message);
}

// Copy doctor dynamically on boot
const srcDoc = 'C:/Users/rahul/.gemini/antigravity-ide/brain/d310c0da-27dc-488b-aa2b-a4c611512e5f/media__1783317308649.jpg';
const destDoc = 'c:/Users/rahul/OneDrive/Desktop/Academy/frontend/public/doctor_hero.jpg';

try {
  if (fs.existsSync(srcDoc)) {
    fs.copyFileSync(srcDoc, destDoc);
    console.log('Doctor image copied dynamically to frontend assets!');
  }
} catch (e) {
  console.error('Doctor copy warning:', e.message);
}

const app = express();

// Security Middlewares
app.use(helmet());

const allowedOrigins = [
  'http://localhost:3000',
  'https://admission-anytime.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);


// Body Parser Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default Route
app.get('/', (req, res) => {
  res.json({ message: 'MBBS Admission Consultancy API is running...' });
});

// Mounting API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;

