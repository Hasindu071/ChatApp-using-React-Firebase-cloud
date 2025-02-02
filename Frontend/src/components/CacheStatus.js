import React from "react";

const CacheStatus = ({ isCached }) => {
  return (
    <div className="cache-status">
      {isCached ? (
        <span className="cached">⚡ Loaded from cache</span>
      ) : (
        <span className="not-cached">📡 Loaded from server</span>
      )}
    </div>
  );
};

export default CacheStatus;
