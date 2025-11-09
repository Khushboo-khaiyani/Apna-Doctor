"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, signup, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isSignUp) {
        await signup(email, password)
      } else {
        await login(email, password)
      }
    } catch (err) {
      console.error("Auth error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Left Side - Image & Testimonial */}
        <div className="hidden md:flex flex-col justify-center items-center">
          <div className="bg-gradient-to-br from-rose-200 to-rose-100 rounded-2xl p-8 text-center max-w-sm">
            <img src="/professional-doctor-with-stethoscope.jpg" alt="Doctor" className="w-full h-80 object-cover rounded-xl mb-6" />
            <p className="text-gray-700 italic text-lg mb-4">"Simply all the tools that my team and I need."</p>
            <p className="text-gray-500 text-sm">Lead Physician</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md p-8 shadow-lg">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to <span className="text-purple-600">Apna Doctor</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isSignUp ? "Create your account to get started" : "Sign in to your account"}
              </p>
            </div>

            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              {!isSignUp && (
                <div className="text-right">
                  <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    Forgot password?
                  </a>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg"
              >
                {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Login"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-gray-500">OR</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-transparent"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
