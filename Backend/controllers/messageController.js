const admin = require("firebase-admin");
const redis = require("../config/redis");

const messageController = {
  getMessages: async (req, res) => {
    try {
      const { chatId } = req.params;
      const messagesRef = admin.firestore().collection("messages");
      const messages = await messagesRef
        .where("chatId", "==", chatId)
        .orderBy("timestamp", "desc")
        .limit(50)
        .get();

      const messageData = messages.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.json(messageData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const { chatId, message, userId } = req.body;
      const messagesRef = admin.firestore().collection("messages");

      await messagesRef.add({
        chatId,
        message,
        userId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      await redis.del(`cache:/messages/${chatId}`);
      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = messageController;
