import mongoose from 'mongoose';
import dotenv from 'dotenv';
import University from '../models/University.js';

dotenv.config();

const realCollegeImages = [
  'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513326738677-b964603b136d?auto=format&fit=crop&w=800&q=80',
];

async function forceUpdateImages() {
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
      // Replace any tattoo photo or invalid unsplash ID with real building photo
      if (!u.coverImage || u.coverImage.includes('1568515045052')) {
        u.coverImage = realCollegeImages[i % realCollegeImages.length];
        await u.save();
        console.log(`Updated cover image for: ${u.name}`);
      }
    }

    console.log('Finished force updating university images.');
    process.exit(0);
  } catch (err) {
    console.error('Error updating images:', err);
    process.exit(1);
  }
}

forceUpdateImages();
