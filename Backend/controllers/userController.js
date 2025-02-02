const admin = require("firebase-admin");
const redis = require("../config/redis");

const userController = {
  getUsers: async (req, res) => {
    try {
      const usersRef = admin.firestore().collection("users");
      const snapshot = await usersRef.get();
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  invalidateUserCache: async (userId) => {
    await redis.del(`cache:/users`);
    await redis.del(`cache:/users/${userId}`);
  },
};

module.exports = userController;
