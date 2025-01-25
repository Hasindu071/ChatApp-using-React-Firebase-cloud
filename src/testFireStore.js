// testFirestore.js
import { db } from "./firebase"; // Import the firebase instance
import { collection, addDoc } from "firebase/firestore";

const testFirestoreConnection = async () => {
  try {
    const docRef = await addDoc(collection(db, "testCollection"), {
      test: "Hello Firebase!",
      timestamp: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

testFirestoreConnection();
