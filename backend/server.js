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
import studentRoutes from './routes/studentRoutes.js';
import marketingRoutes from './routes/marketingRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import securityRoutes from './routes/securityRoutes.js';
import billingRoutes from './routes/billingRoutes.js';

// Load env variables
dotenv.config();

// Connect Database (cached for Vercel serverless)
connectDB().catch((err) => console.error('Initial DB connection failed:', err.message));

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

// Database Connection Middleware for Serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database Connection Error: ' + err.message });
  }
});

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
app.use('/api/students', studentRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/billing', billingRoutes);

// Import models for seeding
import Admin from './models/Admin.js';
import Country from './models/Country.js';
import University from './models/University.js';
import Service from './models/Service.js';
import Testimonial from './models/Testimonial.js';
import Blog from './models/Blog.js';

// Seeding Endpoint to run in cloud (bypasses local DNS issues)
app.get('/api/seed-database-direct-link', async (req, res) => {
  try {
    // Clear existing collections
    await Admin.deleteMany({});
    await Country.deleteMany({});
    await University.deleteMany({});
    await Service.deleteMany({});
    await Testimonial.deleteMany({});
    await Blog.deleteMany({});

    // Seed Admin
    await Admin.create({
      name: 'Senior Admin Officer',
      email: 'admin@admissionanytime.com',
      password: 'admin12345',
      role: 'superadmin'
    });

    // Seed Countries
    const countriesData = [
      {
        name: 'Georgia',
        slug: 'georgia',
        flagImage: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=200&auto=format&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1200&auto=format&fit=crop',
        description: 'Georgia has emerged as one of the top destinations for MBBS. The medical degrees are globally recognized by WHO, NMC (MCI), and FAIMER, and programs are offered 100% in English.',
        benefits: [
          '100% English Medium Curriculum',
          'No Donation or Entrance Exams like IELTS/TOEFL',
          'WHO and NMC (MCI) Approved Universities',
          'Extremely safe European environment for female students'
        ],
        averageCost: '3.5 - 5.5 Lakhs / Year',
        duration: '6 Years (including internship)',
        fmgePassingRate: '28.4% (Highest average)',
        language: 'English',
        requirements: ['50% in PCB in 12th', 'NEET Qualification mandatory'],
        status: 'Active'
      },
      {
        name: 'Russia',
        slug: 'russia',
        flagImage: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=200&auto=format&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=1200&auto=format&fit=crop',
        description: 'Russia is a historic leader in medical education. It offers state-of-the-art laboratory infrastructure, highly subsidized fees by the Russian government, and high quality clinical rotations.',
        benefits: [
          'Highly subsidized Russian Govt medical seats',
          'Low cost of living and affordable tuition fees',
          'Well-equipped diagnostic laboratories',
          'Dual degree options in European networks'
        ],
        averageCost: '2.5 - 4.5 Lakhs / Year',
        duration: '6 Years',
        fmgePassingRate: '21.8%',
        language: 'English / Russian',
        requirements: ['50% in PCB in 12th (40% for SC/ST)', 'NEET Qualified'],
        status: 'Active'
      },
      {
        name: 'Kazakhstan',
        slug: 'kazakhstan',
        flagImage: 'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd?q=80&w=200&auto=format&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd?q=80&w=1200&auto=format&fit=crop',
        description: 'Kazakhstan offers an affordable alternative for MBBS. With close proximity to India, excellent NMC passing record, and structured clinical practice, it is rapidly gaining popularity.',
        benefits: [
          'Very close to India (only 4-hour flight)',
          'Lowest budget MBBS programs in Central Asia',
          'English medium curriculum',
          'Modern, student-centric cities like Almaty'
        ],
        averageCost: '2.2 - 3.5 Lakhs / Year',
        duration: '5 Years',
        fmgePassingRate: '19.5%',
        language: 'English',
        requirements: ['50% in PCB in 12th', 'NEET Qualified'],
        status: 'Active'
      }
    ];
    const seededCountries = await Country.create(countriesData);

    // Seed Universities
    const georgia = seededCountries.find(c => c.slug === 'georgia');
    const russia = seededCountries.find(c => c.slug === 'russia');
    const kazakhstan = seededCountries.find(c => c.slug === 'kazakhstan');

    const universitiesData = [
      {
        name: 'Tbilisi State Medical University',
        country: georgia._id,
        tuitionFee: '$5,000 / Year',
        hostelFee: '$1,000 / Year',
        ranking: 'Country Rank: 4, World Rank: 3840',
        established: '1918',
        mediumOfInstruction: 'English',
        courseDuration: '6 Years',
        keyHighlights: [
          'Oldest and largest medical university in Georgia',
          'Highly clinical curriculum linked with University Hospital',
          'NMC, WHO, and USMLE compatible training'
        ],
        description: 'Tbilisi State Medical University is the leading medical school in Georgia. It holds historical prestige, featuring research partnerships with European universities and high clinical success rates for Indian graduates.',
        logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=150&auto=format&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=800&auto=format&fit=crop',
        status: 'Active'
      },
      {
        name: 'Batumi Shota Rustaveli State University',
        country: georgia._id,
        tuitionFee: '$4,500 / Year',
        hostelFee: '$800 / Year',
        ranking: 'Country Rank: 8',
        established: '1935',
        mediumOfInstruction: 'English',
        courseDuration: '6 Years',
        keyHighlights: [
          'Located in the scenic port city of Batumi',
          'Highly affordable European education standard',
          'Low student-to-teacher ratio in diagnostic labs'
        ],
        description: 'Shota Rustaveli State University offers a modern infrastructure and experienced teaching faculty. The degree is globally recognized, allowing students to pursue internships worldwide.',
        logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=150&auto=format&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=800&auto=format&fit=crop',
        status: 'Active'
      },
      {
        name: 'Kazan Federal University',
        country: russia._id,
        tuitionFee: '3,80,000 Rubles / Year',
        hostelFee: '20,000 Rubles / Year',
        ranking: 'World Rank: 347',
        established: '1804',
        mediumOfInstruction: 'English',
        courseDuration: '6 Years',
        keyHighlights: [
          'Ranked in the top 400 universities globally',
          'Subsidy benefits provided by the Ministry of Education, Russia',
          'Advanced biochemical and research labs'
        ],
        description: 'Kazan Federal University is one of the oldest universities in Russia. It has trained legendary researchers and holds some of the most advanced healthcare laboratories in Eastern Europe.',
        logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=150&auto=format&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=800&auto=format&fit=crop',
        status: 'Active'
      },
      {
        name: 'Astana Medical University',
        country: kazakhstan._id,
        tuitionFee: '$3,500 / Year',
        hostelFee: '$600 / Year',
        ranking: 'Country Rank: 3',
        established: '1964',
        mediumOfInstruction: 'English',
        courseDuration: '5 Years',
        keyHighlights: [
          'Only 5-year course duration following NMC guidelines',
          'Located in the capital city, Nursultan (Astana)',
          'Highly modern clinical testing infrastructure'
        ],
        description: 'Astana Medical University is one of the most prestigious medical colleges in Kazakhstan. It features massive local clinics and provides extensive English-medium lectures.',
        logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=150&auto=format&fit=crop',
        coverImage: 'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd?q=80&w=800&auto=format&fit=crop',
        status: 'Active'
      }
    ];
    await University.create(universitiesData);

    // Seed Services
    const servicesData = [
      {
        title: 'Career Counseling',
        icon: 'FaUserCheck',
        description: 'Personalized expert guidance to match your NEET score, state cut-offs, and financial budget with the best medical college options.',
        detailedContent: 'Our counseling goes beyond list-checking. We analyze student preferences, score patterns, travel history, and career ambitions to build a custom roadmap for MBBS success.',
        order: 1
      },
      {
        title: 'College Selection',
        icon: 'FaUniversity',
        description: 'Detailed analysis of government and private college quotas in India, along with top-rated medical universities abroad.',
        detailedContent: 'Choosing a college is choosing a future. We offer direct comparisons of NMC eligibility, hostel infrastructure, food options, local climate, and clinical patient flows.',
        order: 2
      }
    ];
    await Service.create(servicesData);

    // Seed Testimonials
    const testimonialsData = [
      {
        name: 'Dr. Rahul Sharma',
        university: 'Tbilisi State Medical University',
        country: 'Georgia',
        rating: 5,
        review: 'The counseling and visa processing was completely transparent. I received continuous support and succeeded in passing my FMGE on the first attempt after returning to India!',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150&auto=format&fit=crop',
        status: 'Active'
      }
    ];
    await Testimonial.create(testimonialsData);

    res.json({ success: true, message: 'Database seeded successfully on MongoDB Atlas!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Error Handling Middleware
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;

