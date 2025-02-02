const redis = require("../config/redis");

const cacheMiddleware = (duration) => async (req, res, next) => {
  const key = `cache:${req.originalUrl}`;
  console.log("\n🔍 Checking cache for:", key);

  try {
    const cachedData = await redis.get(key);
    if (cachedData) {
      console.log("✅ Cache HIT:", key);
      console.log("⚡ Serving from cache\n");
      return res.json(JSON.parse(cachedData));
    }

    console.log("❌ Cache MISS:", key);
    console.log("📝 Will cache for", duration, "seconds\n");

    res.originalJson = res.json;
    res.json = (body) => {
      redis.setex(key, duration, JSON.stringify(body));
      console.log("💾 Cached data for:", key);
      res.originalJson(body);
    };
    next();
  } catch (error) {
    console.error("⚠️ Cache Error:", error);
    next();
  }
};

module.exports = cacheMiddleware;
