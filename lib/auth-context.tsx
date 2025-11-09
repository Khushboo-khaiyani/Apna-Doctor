"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { getFirebaseAuth } from "./firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signup: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const auth = getFirebaseAuth()
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signup = async (email: string, password: string) => {
    try {
      setError(null)
      const auth = getFirebaseAuth()
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      const auth = getFirebaseAuth()
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      setError(null)
      const auth = getFirebaseAuth()
      await signOut(auth)
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return <AuthContext.Provider value={{ user, loading, signup, login, logout, error }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
