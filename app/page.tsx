"use client"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { Login } from "@/components/auth/login"
import { DiseaseDetectorApp } from "@/components/disease-detector"

function HomeContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return <DiseaseDetectorApp />
}

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  )
}
