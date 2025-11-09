"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"

const COMMON_SYMPTOMS = [
  "Fever",
  "Cough",
  "Fatigue",
  "Headache",
  "Sore Throat",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Shortness of Breath",
  "Chest Pain",
  "Dizziness",
  "Muscle Pain",
  "Chills",
  "Body Aches",
  "Stomach Pain",
  "Loss of Appetite",
  "Rash",
  "Joint Pain",
]

interface SymptomCheckerProps {
  onAnalyze: (symptoms: string[]) => void
  isAnalyzing: boolean
}

export function SymptomChecker({ onAnalyze, isAnalyzing }: SymptomCheckerProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [customSymptom, setCustomSymptom] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSelectSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom)) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom])
      setCustomSymptom("")
    }
  }

  const handleRemoveSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
  }

  const filteredSymptoms = COMMON_SYMPTOMS.filter((symptom) => symptom.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle>Symptom Checker</CardTitle>
        <CardDescription>Select or add your symptoms to get a preliminary health assessment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Symptoms */}
        {selectedSymptoms.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-3">
              Selected Symptoms ({selectedSymptoms.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => (
                <Badge
                  key={symptom}
                  variant="secondary"
                  className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900"
                  onClick={() => handleRemoveSymptom(symptom)}
                >
                  {symptom}
                  <span className="ml-1">×</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Add Custom Symptom */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Add Custom Symptom</label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter symptom not listed below..."
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCustomSymptom()}
              className="border-slate-300 dark:border-slate-600"
            />
            <Button onClick={handleAddCustomSymptom} disabled={!customSymptom.trim()} size="sm" className="px-4">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        {/* Search Common Symptoms */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Common Symptoms</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-300 dark:border-slate-600"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-2">
            {filteredSymptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => handleSelectSymptom(symptom)}
                disabled={selectedSymptoms.includes(symptom)}
                className="p-3 text-left text-sm rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        <Button
          onClick={() => onAnalyze(selectedSymptoms)}
          disabled={selectedSymptoms.length === 0 || isAnalyzing}
          size="lg"
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Analyzing...
            </>
          ) : (
            "Analyze Symptoms"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
