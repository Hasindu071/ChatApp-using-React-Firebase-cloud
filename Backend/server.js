require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

//const serviceAccount = require("./serviceAccountKey.json"); // Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Convert \n back to newlines
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  }),
  databaseURL: process.env.DATABASE_URL,
});

// ✅ Check Firebase Firestore Health
async function checkFirebaseHealth() {
  try {
    const db = admin.firestore();
    const doc = await db.collection("healthCheck").doc("status").get();
    if (doc.exists) {
      return { status: "✅ Firebase is running" };
    } else {
      return { status: "❌ Firebase might be down!" };
    }
  } catch (error) {
    return { status: "❌ Firebase is unreachable!" };
  }
}

// ✅ API to check Firebase status
app.get("/firebase-health", async (req, res) => {
  try {
    const db = admin.firestore();
    await db.collection("healthCheck").doc("status").get();
    res.json({ status: "Firebase is connected" });
  } catch (error) {
    res.status(500).json({ status: "Firebase connection error" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// 🚨 Notify users if Firebase is down
async function notifyUsers() {
  const db = admin.firestore();
  const usersRef = db.collection("users");

  const snapshot = await usersRef.get();
  snapshot.forEach(async (doc) => {
    await db.collection("notifications").doc(doc.id).set({
      message: "🚨 Firebase is down! We're working on fixing it.",
      timestamp: new Date(),
    });
  });

  console.log("⚠️ Notifications sent to users.");
}

// 🔥 Auto-check Firebase every 1 minute
setInterval(async () => {
  const status = await checkFirebaseHealth();
  if (status.status.includes("❌")) {
    console.log("🔥 Firebase seems to be down! Notifying users...");
    notifyUsers();
  }
}, 10000); // Check every 1/6 min

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
