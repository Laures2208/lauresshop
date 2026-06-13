import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function testAdd() {
  try {
    const accRef = await addDoc(collection(db, "accounts"), {
      title: "Test Acc",
      imageUrl: "https://test.com/img.png",
      price: 100000,
      rank: "Cao Thủ",
      gameUsername: "user123",
      gamePassword: "pass123",
      categoryId: "test-category",
    });
    console.log("Success! ID:", accRef.id);
  } catch (err: any) {
    console.error("Firebase AddDoc Error:", err.message);
  }
  process.exit(0);
}

testAdd();
