import { firebaseConfig, COLLECTION } from "./firebase-config.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
export const DEMO = !firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("YOUR_");

let dbPromise = null;
function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const { initializeApp } = await import(`${SDK}/firebase-app.js`);
      const fs = await import(`${SDK}/firebase-firestore.js`);
      const app = initializeApp(firebaseConfig);
      return { db: fs.getFirestore(app), fs };
    })();
  }
  return dbPromise;
}

// Warm up the SDK early so submit is fast.
export function preload() {
  if (!DEMO) getDb().catch(() => { dbPromise = null; });
}

export async function saveResponse(record) {
  if (DEMO) {
    console.info("[DEMO MODE] Response not saved. Add your Firebase config to firebase-config.js.", record);
    await new Promise((r) => setTimeout(r, 500));
    return "demo";
  }
  const { db, fs } = await getDb();
  const ref = await fs.addDoc(fs.collection(db, COLLECTION), {
    ...record,
    submittedAt: fs.serverTimestamp(),
  });
  return ref.id;
}
