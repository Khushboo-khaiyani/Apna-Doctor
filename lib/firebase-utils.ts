import { getFirebaseDb } from "./firebase"
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore"

export async function saveDiagnosis(
  userId: string,
  data: {
    disease: string
    confidence: number
    symptoms: string[]
    description: string
    recommendations: string[]
    date: Date
  },
) {
  try {
    const db = getFirebaseDb()
    // defensively handle missing `data` or `data.date` so the function
    // won't throw "Cannot read properties of undefined (reading 'date')".
    const { date, ...rest } = data ?? {}
    const timestamp = date ? Timestamp.fromDate(date) : Timestamp.now()
    const docRef = await addDoc(collection(db, "diagnoses"), {
      userId,
      ...rest,
      timestamp,
    })
    return docRef.id
  } catch (error) {
    console.error("Error saving diagnosis:", error)
    throw error
  }
}

export async function getDiagnosisHistory(userId: string) {
  try {
    const db = getFirebaseDb()
    const q = query(collection(db, "diagnoses"), where("userId", "==", userId), orderBy("timestamp", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().timestamp?.toDate() || new Date(),
    }))
  } catch (error: unknown) {
    // If Firestore requires a composite index for this query, the SDK
    // throws an error that includes a URL to create the index in the
    // Firebase Console. Detect that case, log a friendly message, and
    // fall back to a less-efficient client-side sort so the app still
    // works in development.
    let msg: string
    if (error instanceof Error) msg = error.message
    else msg = String(error)
    if (msg.includes("requires an index") && msg.includes("https://")) {
      // Extract the create-index URL (it's included in the error message)
      const urlMatch = msg.match(/https:\/\/[^\s)]+/)
      const createIndexUrl = urlMatch ? urlMatch[0] : undefined
      console.error(
        "Firestore query requires a composite index. Create it in the Firebase Console:",
        createIndexUrl ?? msg,
      )

      try {
        // Fallback: query without orderBy and sort client-side by timestamp
        const db = getFirebaseDb()
        const q = query(collection(db, "diagnoses"), where("userId", "==", userId))
        const querySnapshot = await getDocs(q)
        const items = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...(doc.data() as any) }))
          .sort((a: any, b: any) => {
            const ta = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : new Date(0).getTime()
            const tb = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : new Date(0).getTime()
            return tb - ta
          })
          .map((d: any) => ({ ...d, date: d.timestamp?.toDate?.() || new Date() }))
        return items
      } catch (fallbackError) {
        console.error("Fallback query failed:", fallbackError)
        return []
      }
    }

    console.error("Error getting diagnosis history:", error)
    return []
  }
}
