const axios = require("axios");
const fs = require("fs");

async function checkServerHealth() {
    try {
        const response = await axios.get("http://localhost:5000/health");
        console.log("✅ Server is UP:", response.data);
        
        // Save last known server status (for frontend fallback)
        fs.writeFileSync("server_status.json", JSON.stringify({ status: "UP" }));
    } catch (error) {
        console.log("❌ Server is DOWN!");

        // Save last known status as "DOWN"
        fs.writeFileSync("server_status.json", JSON.stringify({ status: "DOWN" }));
    }
}

// Check every 1 minute
setInterval(checkServerHealth, 60000);
