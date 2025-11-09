import { getFirebaseDb } from "./firebase"
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore"

interface DiagnosisRecord {
  disease: string
  confidence: number
  description: string
  recommendations: string[]
  symptoms: string[]
  timestamp: Date
  userId: string
}

export async function saveDiagnosis(
  userId: string,
  diagnosis: {
    disease: string
    confidence: number
    description: string
    recommendations: string[]
    timestamp: Date
    symptoms: string[]
  },
) {
  try {
    const db = getFirebaseDb()
    const diagnosesCollection = collection(db, "diagnoses")

    const docRef = await addDoc(diagnosesCollection, {
      userId,
      ...diagnosis,
      timestamp: diagnosis.timestamp,
    })

    console.log("Diagnosis saved with ID:", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("Error saving diagnosis:", error)
    throw error
  }
}

export async function getUserDiagnoses(userId: string) {
  try {
    const db = getFirebaseDb()
    const diagnosesCollection = collection(db, "diagnoses")

    const q = query(diagnosesCollection, where("userId", "==", userId), orderBy("timestamp", "desc"))

    const querySnapshot = await getDocs(q)
    const diagnoses: (DiagnosisRecord & { id: string })[] = []

    querySnapshot.forEach((doc) => {
      diagnoses.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date(),
      } as DiagnosisRecord & { id: string })
    })

    return diagnoses
  } catch (error) {
    console.error("Error fetching diagnoses:", error)
    throw error
  }
}
