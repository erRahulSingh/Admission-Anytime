import mongoose from 'mongoose';
import dns from 'dns';
import fs from 'fs';

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
    const localUri = 'mongodb://127.0.0.1:27017/mbbs_consultancy';

    cached.promise = attemptConnect(mongoUri)
      .then((mongooseInstance) => {
        console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
        try { fs.unlinkSync('c:\\Users\\rahul\\OneDrive\\Desktop\\Academy\\backend\\db_error.txt'); } catch (e) {}
        return mongooseInstance;
      })
      .catch(async (error) => {
        const errorMsg = `Primary DB connection failed: ${error.message}\n`;
        fs.writeFileSync('c:\\Users\\rahul\\OneDrive\\Desktop\\Academy\\backend\\db_error.txt', errorMsg);

        // Try local connection fallback
        if (mongoUri !== localUri) {
          try {
            console.log('Attempting connection to local MongoDB fallback...');
            const localInstance = await attemptConnect(localUri);
            console.log(`MongoDB Connected via Local Fallback: ${localInstance.connection.host}`);
            try { fs.unlinkSync('c:\\Users\\rahul\\OneDrive\\Desktop\\Academy\\backend\\db_error.txt'); } catch (e) {}
            return localInstance;
          } catch (localErr) {
            fs.appendFileSync('c:\\Users\\rahul\\OneDrive\\Desktop\\Academy\\backend\\db_error.txt', `Local DB connection fallback failed: ${localErr.message}\n`);
          }
        }

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
            try { fs.unlinkSync('c:\\Users\\rahul\\OneDrive\\Desktop\\Academy\\backend\\db_error.txt'); } catch (e) {}
            return fallbackInstance;
          } catch (fallbackErr) {
            fs.appendFileSync('c:\\Users\\rahul\\OneDrive\\Desktop\\Academy\\backend\\db_error.txt', `Direct shard fallback failed: ${fallbackErr.message}\n`);
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
