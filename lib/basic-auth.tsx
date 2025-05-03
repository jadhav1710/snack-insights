"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface BasicAuthProps {
  children: React.ReactNode
}

export function BasicAuth({ children }: BasicAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would check for a valid session
    // For this demo, we'll just simulate authentication
    const checkAuth = () => {
      // For demo purposes, always authenticate after a brief delay
      setTimeout(() => {
        setIsAuthenticated(true)
        setIsLoading(false)
      }, 500)
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="w-full max-w-md space-y-8 p-8 rounded-2xl border shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold">PepsiCo × 7-Eleven</h1>
            <p className="text-muted-foreground">Salty-Snacks Dashboard Suite</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="username">
                Username
              </label>
              <input id="username" className="w-full rounded-lg border p-2" placeholder="Enter your username" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full rounded-lg border p-2"
                placeholder="Enter your password"
              />
            </div>
            <button className="w-full rounded-lg bg-primary p-2 text-white" onClick={() => setIsAuthenticated(true)}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
