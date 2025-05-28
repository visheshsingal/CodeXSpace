"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "login" | "signup"
  onModeChange: (mode: "login" | "signup") => void
  onAuthSuccess: (userData: { name: string; email: string; id: string }) => void
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange, onAuthSuccess }: AuthModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (mode === "signup" && !formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (mode === "signup" && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onAuthSuccess({
          name: data.user.name,
          email: data.user.email,
          id: data.user.id,
        })
        setFormData({ name: "", email: "", password: "", confirmPassword: "" })
      } else {
        setErrors({ general: data.error || "Authentication failed" })
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md mx-4 bg-bgCard rounded-2xl p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-lightGray hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
          <p className="text-darkGray">
            {mode === "login" ? "Sign in to your account" : "Join us and start your journey"}
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "signup" && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-lightGray mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-borderGray rounded-lg text-white placeholder-darkGray focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-lightGray mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-borderGray rounded-lg text-white placeholder-darkGray focus:outline-none focus:border-primary transition-colors"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-lightGray mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-borderGray rounded-lg text-white placeholder-darkGray focus:outline-none focus:border-primary transition-colors"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {mode === "signup" && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-lightGray mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-borderGray rounded-lg text-white placeholder-darkGray focus:outline-none focus:border-primary transition-colors"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-background px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all h-[56px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-darkGray">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => onModeChange(mode === "login" ? "signup" : "login")}
              className="text-primary hover:underline font-medium"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        {mode === "login" && (
          <div className="mt-4 text-center">
            <button className="text-sm text-darkGray hover:text-primary transition-colors">
              Forgot your password?
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
