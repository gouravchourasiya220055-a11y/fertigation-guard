import mongoose from "mongoose";
import dns from "dns/promises";
import { URL } from "url";

async function resolveSrvToMongoUri(srvUri) {
  try {
    const parsed = new URL(srvUri);
    if (parsed.protocol !== 'mongodb+srv:') {
      return srvUri;
    }

    const username = parsed.username ? encodeURIComponent(decodeURIComponent(parsed.username)) : '';
    const password = parsed.password ? encodeURIComponent(decodeURIComponent(parsed.password)) : '';
    const authString = username ? `${username}:${password}@` : '';
    const hostname = parsed.hostname;
    
    // Explicitly use Google DNS to bypass local ISP blocks
    const dnsSync = await import('dns');
    dnsSync.setServers(['8.8.8.8', '8.8.4.4']);

    const srvRecords = await dns.resolveSrv(`_mongodb._tcp.${hostname}`);
    const txtRecords = await dns.resolveTxt(hostname);
    
    const hosts = srvRecords.map(record => `${record.name}:${record.port}`).join(',');
    const txtOptions = txtRecords.flat().join('&');
    
    let standardUri = `mongodb://${authString}${hosts}${parsed.pathname}`;
    
    const existingParams = parsed.searchParams;
    // Force tls=true for Atlas explicitly when falling back from mongodb+srv
    existingParams.set('tls', 'true');
    
    const queryParams = [txtOptions, existingParams.toString()].filter(Boolean).join('&');
    
    if (queryParams) {
       standardUri += `?${queryParams}`;
    }
    
    return standardUri;
  } catch (error) {
    console.error('Failed to resolve SRV records manually:', error.message);
    return null;
  }
}

const connectDB = async () => {
  try {
    if (process.env.DEMO_MODE === 'true') {
      console.log("Demo mode enabled. Skipping MongoDB connection.");
      return;
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected:", conn.connection.host);
  } catch (err) {
    if (err.message && err.message.includes('querySrv')) {
      console.log("DNS/SRV issue detected. Resolving SRV manually to fall back to mongodb:// standard connection...");
      try {
        const fallbackUri = await resolveSrvToMongoUri(process.env.MONGODB_URI);
        if (!fallbackUri) {
          throw new Error("Failed to construct fallback URI");
        }
        const conn = await mongoose.connect(fallbackUri);
        console.log("MongoDB Connected:", conn.connection.host);
        return;
      } catch (retryErr) {
        console.error("FULL ERROR ON RETRY:", retryErr.message);
        process.exit(1);
      }
    }
    
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;