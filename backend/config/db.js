import mongoose from 'mongoose';
import dns from 'dns';
import fs from 'fs';
import path from 'path';

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

const getErrorFilePath = () => path.join(process.cwd(), 'db_error.txt');

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

  if (!cached.promise) {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mbbs_consultancy';
    const localUri = 'mongodb://127.0.0.1:27017/mbbs_consultancy';

    cached.promise = attemptConnect(mongoUri)
      .then((mongooseInstance) => {
        console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
        clearErrorLog();
        return mongooseInstance;
      })
      .catch(async (error) => {
        const errorMsg = `Primary DB connection failed: ${error.message}\n`;
        writeErrorLog(errorMsg, false);

        // Try local connection fallback
        if (mongoUri !== localUri) {
          try {
            console.log('Attempting connection to local MongoDB fallback...');
            const localInstance = await attemptConnect(localUri);
            console.log(`MongoDB Connected via Local Fallback: ${localInstance.connection.host}`);
            clearErrorLog();
            return localInstance;
          } catch (localErr) {
            writeErrorLog(`Local DB connection fallback failed: ${localErr.message}\n`, true);
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
            clearErrorLog();
            return fallbackInstance;
          } catch (fallbackErr) {
            writeErrorLog(`Direct shard fallback failed: ${fallbackErr.message}\n`, true);
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
