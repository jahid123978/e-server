// utils/redisClient.js
const { createClient } = require("redis");

const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000)
  },
  password: process.env.REDIS_PASSWORD || undefined
});

// Add proper error handling
redis.on('error', (err) => {
  if (err.code === 'ECONNREFUSED') {
    console.error('❌ Redis server not running');
    process.exit(1);
  }
  console.error('Redis error:', err);
});

// Use connection wrapper with retries
(async () => {
  try {
    await redis.connect();
    console.log('✅ Redis connected');
    
    // Test connection
    await redis.set('connection_test', 'OK');
    const value = await redis.get('connection_test');
    console.log('Connection test:', value === 'OK' ? 'Success' : 'Failed');
    
  } catch (err) {
    console.error('❌ Redis connection failed:', err.message);
    process.exit(1);
  }
})();

module.exports = redis;