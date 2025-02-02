import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const api = {
  getUsers: async () => {
    try {
      console.log("🔍 Fetching users...");
      const response = await axios.get(`${API_BASE_URL}/users`);
      console.log(
        "📥 Users data received:",
        response.headers["x-cache"] ? "from cache" : "from server"
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      throw error;
    }
  },

  getMessages: async (chatId) => {
    try {
      console.log(`🔍 Fetching messages for chat ${chatId}...`);
      const response = await axios.get(`${API_BASE_URL}/messages/${chatId}`);
      console.log(
        "📥 Messages data received:",
        response.headers["x-cache"] ? "from cache" : "from server"
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      throw error;
    }
  },
};

export default api;
