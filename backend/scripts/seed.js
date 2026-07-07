import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Models
import Admin from '../models/Admin.js';
import Country from '../models/Country.js';
import University from '../models/University.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import Blog from '../models/Blog.js';

dotenv.config();

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
  },
  {
    title: 'Documentation',
    icon: 'FaFileAlt',
    description: 'Fuss-free translation, apostille, verification, and formatting of student transcripts, medical certificates, and NEET cards.',
    detailedContent: 'Foreign admissions require complex legal verifications. We handle the paperwork, apostille stamps from the Ministry of External Affairs, and native translation certificates.',
    order: 3
  },
  {
    title: 'Visa Assistance',
    icon: 'FaCcVisa',
    description: 'Complete student visa guidance from embassy interview mockups to secure slot booking and guaranteed approvals.',
    detailedContent: 'We maintain a 100% student visa approval rate. We prepare your files, draft strong personal statements, lock down appointments, and coordinate with national embassies.',
    order: 4
  },
  {
    title: 'Education Loan',
    icon: 'FaCoins',
    description: 'Strategic tie-ups with leading national banks to help families secure fast-track, low-interest student loans.',
    detailedContent: 'Our financial advisory team guides you on collateral and non-collateral bank loans, providing formal university fee structures and document bundles required by bank managers.',
    order: 5
  },
  {
    title: 'Travel & Departure',
    icon: 'FaPlaneDeparture',
    description: 'Group flight bookings, custom pre-departure orientations, and expert airport pickup escorts for peace of mind.',
    detailedContent: 'We send students in dedicated batches accompanied by a representative. From booking flights to securing baggage allowances, we stay with them till they reach campus.',
    order: 6
  }
];

const testimonialsData = [
  {
    name: 'Dr. Rahul Sharma',
    university: 'Tbilisi State Medical University',
    country: 'Georgia',
    rating: 5,
    review: 'The counseling and visa processing was completely transparent. I received continuous support and succeeded in passing my FMGE on the first attempt after returning to India!',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150&auto=format&fit=crop',
    status: 'Active'
  },
  {
    name: 'Anjali Deshmukh',
    university: 'Kazan Federal University',
    country: 'Russia',
    rating: 5,
    review: 'As parents, safety was our top concern. They arranged separate secure Indian hostels, food catering, and regular academic updates. I highly recommend their MBBS counseling.',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=150&auto=format&fit=crop',
    status: 'Active'
  }
];

const blogsData = [
  {
    title: 'NMC New Guidelines for MBBS Abroad',
    excerpt: 'Detailed analysis of the latest guidelines issued by the National Medical Commission (NMC) regarding course duration, medium of instruction, and licensing exams.',
    content: `### Understanding the NMC (MCI) Regulations
    
The National Medical Commission (NMC) has set strict regulations for Indian students planning to study MBBS abroad:

1. **Course Duration:** The course duration must be a minimum of 54 months (4.5 years) with an additional 12-month internship at the same foreign university.
2. **Medium of Instruction:** The entire medical course must be taught in English medium. Bilingual courses (Russian/Local language in initial years) are no longer accepted for NMC registration.
3. **Registration:** The student must be registered with the respective medical council of the country where they graduated.

Before choosing an MBBS destination, check these compliance points carefully to avoid registration issues upon returning to India.`,
    author: 'Chief Education Advisor',
    featuredImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop',
    status: 'Published'
  },
  {
    title: 'How to Choose Between MBBS in India and MBBS Abroad',
    excerpt: 'Confused between waiting for a management quota seat in India or going abroad? Compare budgets, rankings, clinical exposures, and future prospects.',
    content: `### India vs Abroad: A Comparative Guide

For Indian medical aspirants, deciding between private colleges in India and universities abroad is a significant step. Here is a comparison:

#### 1. Financial Budget
* **Private Medical Colleges in India:** Total fees can range between 60 Lakhs to over 1 Crore, including high deposits.
* **Top Universities Abroad (Georgia/Russia):** Total cost ranges between 15 to 30 Lakhs, covering tuition, hostel, and food.

#### 2. Clinical Exposure and Patient Load
Many government hospitals abroad feature massive patient flows, allowing hands-on diagnostics and advanced instrumentation training.

#### 3. FMGE / NEXT Exam
Regardless of where you study (private India or foreign university), every student must pass the NExT licensing exam to practice in India. Hence, the quality of FMGE preparation is the ultimate decider.`,
    author: 'Counselor Neha Verma',
    featuredImage: 'https://images.unsplash.com/photo-1584515901367-f134981d40e1?q=80&w=600&auto=format&fit=crop',
    status: 'Published'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mbbs_consultancy');
    console.log('Connected to database for seeding...');

    // Clear existing collections
    await Admin.deleteMany({});
    await Country.deleteMany({});
    await University.deleteMany({});
    await Service.deleteMany({});
    await Testimonial.deleteMany({});
    await Blog.deleteMany({});

    console.log('Wiped out existing databases.');

    // Seed Admin
    await Admin.create({
      name: 'Senior Admin Officer',
      email: 'admin@admissionanytime.com',
      password: 'admin12345',
      role: 'superadmin'
    });
    console.log('Admin account seeded (admin@admissionanytime.com / admin12345)');

    // Seed Countries
    const seededCountries = await Country.create(countriesData);
    console.log('Seeded country records.');

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
    console.log('Seeded university data.');

    // Seed Services
    await Service.create(servicesData);
    console.log('Seeded services data.');

    // Seed Testimonials
    await Testimonial.create(testimonialsData);
    console.log('Seeded testimonials.');

    // Seed Blogs
    await Blog.create(blogsData);
    console.log('Seeded blogs.');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error.message);
    process.exit(1);
  }
};

seedDatabase();
