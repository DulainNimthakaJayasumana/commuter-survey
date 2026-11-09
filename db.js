import { firebaseConfig, COLLECTION } from "./firebase-config.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2";

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
  getDb().catch(() => { dbPromise = null; });
}

// Is the survey accepting responses? (Admins switch this in /admin.)
export async function isSurveyOpen() {
  try {
    const { db, fs } = await getDb();
    const snap = await fs.getDoc(fs.doc(db, "config", "survey"));
    return !snap.exists() || snap.data().open !== false;
  } catch (e) {
    console.warn("Could not read survey status", e);
    return true;
  }
}

export async function saveResponse(record) {
  const { db, fs } = await getDb();
  const ref = await fs.addDoc(fs.collection(db, COLLECTION), {
    ...record,
    submittedAt: fs.serverTimestamp(),
  });
  return ref.id;
}
