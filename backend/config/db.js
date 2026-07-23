import mongoose from 'mongoose';
import dns from 'dns';

// Fix Node.js DNS SRV resolution issues on Windows & Vercel serverless environments
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  /* Ignore if custom DNS set is restricted */
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

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

  if (!cached.promise) {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mbbs_consultancy';

    cached.promise = attemptConnect(mongoUri)
      .then((mongooseInstance) => {
        console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
        return mongooseInstance;
      })
      .catch(async (error) => {
        console.error(`Primary DB connection failed (${error.message}). Trying DNS & Fallback...`);
        
        // If SRV lookup failed, construct direct replica set connection string
        if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
          try {
            // Convert srv URI to direct shard node URIs
            let fallbackUri = mongoUri;
            if (fallbackUri.startsWith('mongodb+srv://')) {
              const match = fallbackUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)(\?.*)?/);
              if (match) {
                const [, user, pass, host, dbName, query] = match;
                const clusterPrefix = host.replace('.mongodb.net', '');
                
                // Build direct shard nodes string
                fallbackUri = `mongodb://${user}:${pass}@${clusterPrefix}-shard-00-00.${host.split('.').slice(1).join('.')}:27017,${clusterPrefix}-shard-00-01.${host.split('.').slice(1).join('.')}:27017,${clusterPrefix}-shard-00-02.${host.split('.').slice(1).join('.')}:27017/${dbName}?ssl=true&replicaSet=atlas-${clusterPrefix.split('.').pop()}-shard-0&authSource=admin&retryWrites=true&w=majority`;
              }
            }
            const fallbackInstance = await attemptConnect(fallbackUri);
            console.log(`MongoDB Connected via Direct Shards: ${fallbackInstance.connection.host}`);
            return fallbackInstance;
          } catch (fallbackErr) {
            console.error(`Direct shard fallback failed: ${fallbackErr.message}`);
          }
        }

        cached.promise = null;
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
