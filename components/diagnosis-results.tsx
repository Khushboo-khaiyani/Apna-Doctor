"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, FileText } from "lucide-react"
import { useEffect } from "react"
import { saveDiagnosis } from "@/lib/firebase-utils"

interface DiagnosisResultsProps {
  diagnosis: {
    disease: string
    confidence: number
    description: string
    recommendations: string[]
  }
  symptoms: string[]
}

export function DiagnosisResults({ diagnosis, symptoms }: DiagnosisResultsProps) {
  useEffect(() => {
    // Save diagnosis to Firebase
    saveDiagnosis({
      disease: diagnosis.disease,
      confidence: diagnosis.confidence,
      symptoms,
      date: new Date(),
    })
  }, [diagnosis, symptoms])

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return "text-red-600 dark:text-red-400"
    if (confidence >= 50) return "text-amber-600 dark:text-amber-400"
    return "text-green-600 dark:text-green-400"
  }

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 75) return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
    if (confidence >= 50) return "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800"
    return "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
  }

  return (
    <div className="space-y-6">
      {/* Primary Diagnosis */}
      <Card className={`border-2 ${getConfidenceBg(diagnosis.confidence)}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{diagnosis.disease}</CardTitle>
              <CardDescription className="text-base">{diagnosis.description}</CardDescription>
            </div>
            <CheckCircle className={`w-8 h-8 flex-shrink-0 ${getConfidenceColor(diagnosis.confidence)}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Confidence Level</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      diagnosis.confidence >= 75
                        ? "bg-red-500"
                        : diagnosis.confidence >= 50
                          ? "bg-amber-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${diagnosis.confidence}%` }}
                  ></div>
                </div>
                <span className={`font-bold text-lg ${getConfidenceColor(diagnosis.confidence)}`}>
                  {diagnosis.confidence}%
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-2">Reported Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="inline-block px-3 py-1 text-sm bg-slate-200 dark:bg-slate-700 text-foreground rounded-full"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Health Recommendations
          </CardTitle>
          <CardDescription>Follow these steps to manage your symptoms</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {diagnosis.recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-3 text-sm">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground font-semibold flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="text-foreground pt-0.5">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            • This assessment is based on symptoms alone and should not be considered a professional medical diagnosis.
          </p>
          <p>• Always consult with a licensed healthcare provider for proper evaluation and treatment.</p>
          <p>• If you experience severe symptoms or medical emergency, seek immediate medical attention.</p>
          <p>• Keep a record of your symptoms and this assessment to share with your doctor.</p>
        </CardContent>
      </Card>
    </div>
  )
}
