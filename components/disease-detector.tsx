"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SymptomChecker } from "./symptom-checker"
import { DiagnosisResults } from "./diagnosis-results"
import { PatientHistory } from "./patient-history"
import { AlertCircle, LogOut } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { saveDiagnosis } from "@/lib/firebase-utils"

interface Diagnosis {
  disease: string
  confidence: number
  description: string
  recommendations: string[]
}

export function DiseaseDetectorApp() {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState("checker")
  const { user, logout } = useAuth()

  const handleAnalyzeSymptoms = async (selectedSymptoms: string[]) => {
    setSymptoms(selectedSymptoms)
    setIsAnalyzing(true)

    const result = analyzeSymptoms(selectedSymptoms)
    setDiagnosis(result)

    if (user) {
      await saveDiagnosis(user.uid, {
        ...result,
        symptoms: selectedSymptoms,
        date: new Date(),
      })
    }

    setIsAnalyzing(false)
    setActiveTab("results")
  }

  const analyzeSymptoms = (symptoms: string[]): Diagnosis => {
    const symptomLower = symptoms.map((s) => s.toLowerCase())

    if (
      symptomLower.some((s) =>
        ["cough", "fever", "fatigue", "shortness of breath"].some((keyword) => s.includes(keyword)),
      )
    ) {
      return {
        disease: "Common Respiratory Infection",
        confidence: Math.min(90, 50 + symptoms.length * 8),
        description: "Based on your symptoms, you may have a common respiratory infection such as a cold or mild flu.",
        recommendations: [
          "Rest for 7-10 days",
          "Stay hydrated with water and warm beverages",
          "Use over-the-counter pain relievers as needed",
          "Consult a doctor if symptoms persist beyond 2 weeks",
          "Wear a mask around others",
        ],
      }
    }

    if (
      symptomLower.some((s) =>
        ["headache", "neck stiffness", "light sensitivity", "fever"].some((keyword) => s.includes(keyword)),
      )
    ) {
      return {
        disease: "Migraine or Tension Headache",
        confidence: Math.min(85, 45 + symptoms.length * 8),
        description: "Your symptoms suggest a migraine or severe tension headache.",
        recommendations: [
          "Rest in a dark, quiet room",
          "Apply cold or warm compress",
          "Take prescribed migraine medication",
          "Stay hydrated",
          "Avoid triggers if identified",
        ],
      }
    }

    if (
      symptomLower.some((s) =>
        ["nausea", "vomiting", "diarrhea", "stomach pain"].some((keyword) => s.includes(keyword)),
      )
    ) {
      return {
        disease: "Gastrointestinal Disorder",
        confidence: Math.min(80, 40 + symptoms.length * 8),
        description:
          "Your symptoms indicate a possible gastrointestinal issue such as food poisoning or gastroenteritis.",
        recommendations: [
          "Consume clear liquids and electrolyte solutions",
          "Avoid solid foods until symptoms improve",
          "Take anti-nausea medication if prescribed",
          "Monitor for dehydration",
          "Seek medical attention if symptoms worsen",
        ],
      }
    }

    return {
      disease: "General Health Concern",
      confidence: Math.max(30, 20 + symptoms.length * 5),
      description:
        "Based on your symptoms, we recommend consulting with a healthcare professional for proper evaluation.",
      recommendations: [
        "Schedule an appointment with your doctor",
        "Keep track of symptom patterns",
        "Maintain a healthy lifestyle",
        "Stay hydrated and get adequate rest",
        "Monitor symptoms for changes",
      ],
    }
  }

  const handleReset = () => {
    setSymptoms([])
    setDiagnosis(null)
    setActiveTab("checker")
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-2">MediDetect</h1>
            <p className="text-lg text-muted-foreground">Advanced Disease Detection & Health Advisory System</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">{user?.email}</div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Disclaimer Alert */}
        <Alert className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-900">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            This tool provides general health information only. It is not a substitute for professional medical advice.
            Always consult with a qualified healthcare provider for accurate diagnosis and treatment.
          </AlertDescription>
        </Alert>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="checker">Symptom Checker</TabsTrigger>
            <TabsTrigger value="results" disabled={!diagnosis}>
              Analysis
            </TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
          </TabsList>

          {/* Symptom Checker Tab */}
          <TabsContent value="checker">
            <SymptomChecker onAnalyze={handleAnalyzeSymptoms} isAnalyzing={isAnalyzing} />
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            {diagnosis && <DiagnosisResults diagnosis={diagnosis} symptoms={symptoms} />}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <PatientHistory onSelectDiagnosis={(d) => setDiagnosis(d)} />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        {diagnosis && (
          <div className="flex gap-4 mt-8 justify-center">
            <Button onClick={handleReset} variant="outline" size="lg">
              Start New Check
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
