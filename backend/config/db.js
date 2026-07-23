import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mbbs_consultancy';

    cached.promise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      bufferCommands: true,
    }).then((mongoose) => {
      console.log(`MongoDB Connected: ${mongoose.connection.host}`);
      return mongoose;
    }).catch((error) => {
      cached.promise = null;
      console.error(`MongoDB connection error: ${error.message}`);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default connectDB;
