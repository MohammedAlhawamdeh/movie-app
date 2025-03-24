const NodeCache = require('node-cache');

// Create a cache instance with a default TTL of 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

const cacheWithTTL = async (key, ttl, fetchFunction) => {
  // Try to get data from cache
  const cachedData = cache.get(key);
  if (cachedData) {
    console.log(`Cache hit for key: ${key}`);
    return cachedData;
  }

  // If not in cache, fetch data
  console.log(`Cache miss for key: ${key}`);
  const data = await fetchFunction();
  
  // Store in cache
  cache.set(key, data, ttl);
  return data;
};

const clearCache = (key) => {
  if (key) {
    cache.del(key);
  } else {
    cache.flushAll();
  }
};

module.exports = {
  cache,
  cacheWithTTL,
  clearCache
};