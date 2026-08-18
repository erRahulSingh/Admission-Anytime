import mongoose from 'mongoose';
import dns from 'dns';
import fs from 'fs';
import path from 'path';

// Fix Node.js DNS SRV resolution issues on local Windows only
if (process.platform === 'win32' && !process.env.RENDER && !process.env.VERCEL) {
  try {
    dns.setDefaultResultOrder('ipv4first');
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  } catch (e) {
    /* Ignore if custom DNS set is restricted */
  }
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const getErrorFilePath = () => {
  if (process.env.VERCEL) {
    return path.join('/tmp', 'db_error.txt');
  }
  return path.join(process.cwd(), 'db_error.txt');
};

const clearErrorLog = () => {
  try {
    const errorFile = getErrorFilePath();
    if (fs.existsSync(errorFile)) {
      fs.unlinkSync(errorFile);
    }
  } catch (e) {
    /* Ignore read-only or permission errors */
  }
};

const writeErrorLog = (msg, append = false) => {
  try {
    const errorFile = getErrorFilePath();
    if (append) {
      fs.appendFileSync(errorFile, msg);
    } else {
      fs.writeFileSync(errorFile, msg);
    }
  } catch (e) {
    console.error('DB Error Logger:', msg.trim());
  }
};

const attemptConnect = async (uri) => {
  return mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    bufferCommands: false,
  });
};

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (e) {
      cached.promise = null;
    }
  }

  const ATLAS_DEFAULT_URI = 'mongodb+srv://info_db_user:CN83HDFuCBhbqDq7@cluster0.d1f4yq1.mongodb.net/mbbs_consultancy?retryWrites=true&w=majority';
  const primaryUri = process.env.MONGODB_URI || process.env.MONGO_URI || ATLAS_DEFAULT_URI;
  const secondaryAtlasUri = process.env.BACKUP_MONGO_URI;
  const isCloud = Boolean(process.env.RENDER || process.env.VERCEL || process.env.NODE_ENV === 'production');
  const localUri = !isCloud ? 'mongodb://127.0.0.1:27017/mbbs_consultancy' : null;

  const urisToTry = [
    primaryUri,
    ATLAS_DEFAULT_URI,
    secondaryAtlasUri,
    localUri,
  ].filter(Boolean);

  let lastError = null;

  cached.promise = (async () => {
    for (const uri of urisToTry) {
      try {
        const hostInfo = uri.includes('@') ? uri.split('@').pop() : uri;
        console.log(`Connecting to MongoDB candidate: ${hostInfo}...`);
        const instance = await attemptConnect(uri);
        console.log(`MongoDB Connected successfully! Host: ${instance.connection.host}`);
        clearErrorLog();
        return instance;
      } catch (err) {
        lastError = err;
        console.warn(`Connection attempt failed for ${uri.includes('@') ? uri.split('@').pop() : uri}: ${err.message}`);
        writeErrorLog(`Failed to connect: ${err.message}\n`, true);
      }
    }
    throw lastError || new Error('Database connection failed for all candidate URIs');
  })();

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
};

export default connectDB;
