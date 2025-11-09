"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getDiagnosisHistory } from "@/lib/firebase-utils"
import { Calendar, Stethoscope } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface PatientHistoryProps {
  onSelectDiagnosis: (diagnosis: any) => void
}

export function PatientHistory({ onSelectDiagnosis }: PatientHistoryProps) {
  const { user } = useAuth()
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return
      const data = await getDiagnosisHistory(user.uid)
      setHistory(data)
      setIsLoading(false)
    }
    loadHistory()
  }, [user])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading medical history...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5" />
          Medical History
        </CardTitle>
        <CardDescription>Your previous diagnoses and assessments</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No medical history recorded yet</p>
        ) : (
          <div className="space-y-3">
            {history.map((record, idx) => (
              <div
                key={idx}
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{record.disease}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary">{record.confidence}% confidence</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Symptoms: {record.symptoms.join(", ")}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
