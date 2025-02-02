import React, { useEffect, useState } from "react";
import api from "../services/api";

const CacheTest = () => {
  const [cacheStats, setCacheStats] = useState({
    hits: 0,
    misses: 0,
  });

  const testCache = async () => {
    console.log("🧪 Testing cache...");

    // First request (cache miss)
    await api.getUsers();

    // Second request (should hit cache)
    await api.getUsers();

    // Third request (should hit cache)
    await api.getUsers();
  };

  return (
    <div>
      <button onClick={testCache}>Test Cache</button>
      <div>
        Cache Hits: {cacheStats.hits}
        Cache Misses: {cacheStats.misses}
      </div>
    </div>
  );
};

export default CacheTest;
