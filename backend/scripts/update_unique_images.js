import mongoose from 'mongoose';
import dotenv from 'dotenv';
import University from '../models/University.js';

dotenv.config();

const campusImagePool = [
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584515901367-f134981d40e1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
];

async function updateUniqueImages() {
  try {
    let mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mbbs_consultancy';
    if (mongoUri.includes('w=gvjfwww')) {
      mongoUri = mongoUri.replace('w=gvjfwww', 'w=majority');
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to DB...');

    const unis = await University.find();
    console.log(`Found ${unis.length} universities.`);

    for (let i = 0; i < unis.length; i++) {
      const u = unis[i];
      u.coverImage = campusImagePool[i % campusImagePool.length];
      await u.save();
      console.log(`Updated unique campus photo for: ${u.name}`);
    }

    console.log('Finished assigning unique campus photos.');
    process.exit(0);
  } catch (err) {
    console.error('Error updating unique images:', err);
    process.exit(1);
  }
}

updateUniqueImages();
