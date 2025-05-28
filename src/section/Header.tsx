"use client"

import { useState, useEffect } from "react"
import FadeDown from "../components/animations/FadeDown"
import Logo from "../components/ui/Logo"
import AuthModal from "./AuthModal"
import ProfileDropdown from "./ProfileDropdown"

interface HeaderItem {
  name: string
  id: string
}

interface User {
  name: string
  email: string
  initial: string
  id: string
}

const headerList: HeaderItem[] = [
  { name: "Process", id: "process" },
  { name: "Benefits", id: "benefits" },
  { name: "Services", id: "services" },
  { name: "FAQ", id: "faq" },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [isBurgerActive, setIsBurgerActive] = useState<boolean>(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const toggleBurger = () => {
    setIsBurgerActive(!isBurgerActive)
  }

  // Check if user is already logged in
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const userData = await response.json()
        setUser({
          name: userData.name,
          email: userData.email,
          initial: userData.name.charAt(0).toUpperCase(),
          id: userData.id,
        })
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const handleAuthSuccess = (userData: { name: string; email: string; id: string }) => {
    const initial = userData.name.charAt(0).toUpperCase()
    setUser({
      name: userData.name,
      email: userData.email,
      initial: initial,
      id: userData.id,
    })
    setIsAuthModalOpen(false)
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleSignUpClick = () => {
    openAuthModal("signup")
  }

  const handleEnrollClick = () => {
    // Your existing enroll functionality
    const element = document.getElementById("pricing")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (isLoading) {
    return (
      <div className="relative" id="header">
        <FadeDown>
          <div className="mx-7 flex items-center justify-between rounded-3xl py-7 text-text">
            <Logo />
            <div className="hidden items-center gap-20 lg:flex">
              <div className="flex flex-row gap-10 font-normal">
                {headerList.map((item) => (
                  <a href={`#${item.id}`} key={item.id} className="cursor-pointer transition-all hover:text-gray-300">
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="w-32 h-14 bg-bgCard animate-pulse rounded-lg"></div>
            </div>
          </div>
        </FadeDown>
      </div>
    )
  }

  return (
    <div className="relative" id="header">
      <FadeDown>
        <div className="mx-7 flex items-center justify-between rounded-3xl py-7 text-text">
          <Logo />
          <div className="hidden items-center gap-20 lg:flex">
            <div className="flex flex-row gap-10 font-normal">
              {headerList.map((item) => (
                <a href={`#${item.id}`} key={item.id} className="cursor-pointer transition-all hover:text-gray-300">
                  {item.name}
                </a>
              ))}
            </div>

            {user ? (
              <ProfileDropdown user={user} onLogout={handleLogout} />
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openAuthModal("login")}
                  className="px-6 py-2 text-text hover:text-primary transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleSignUpClick}
                  className="bg-primary text-background px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all h-[56px] w-[120px] flex items-center justify-center"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center lg:hidden">
            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen)
                toggleBurger()
              }}
              className="relative flex h-20 w-20 items-center justify-center"
              aria-label="Burger menu"
            >
              <div className="relative w-full">
                <div
                  className={`absolute left-1/2 h-[1px] w-[40%] -translate-x-1/2 transform bg-white transition-all duration-500 ${
                    isBurgerActive ? "top-0 rotate-45" : "-top-1.5"
                  }`}
                ></div>
                <div
                  className={`absolute left-1/2 h-[1px] w-[40%] -translate-x-1/2 transform bg-white transition-all duration-500 ${
                    isBurgerActive ? "top-0 -rotate-45" : "top-1.5"
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`top-18 fixed right-0 z-50 h-screen w-full bg-background text-2xl text-white transition-transform duration-500 ease-in-out lg:hidden ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end p-4"></div>
          <ul className="mx-8 flex flex-col items-start gap-8 font-normal">
            {headerList.map((item) => (
              <li key={item.id} className="w-full">
                <a
                  href={`#${item.id}`}
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen)
                    toggleBurger()
                  }}
                  className="cursor-pointer underline underline-offset-8 transition-all hover:text-primary"
                >
                  {item.name}
                </a>
              </li>
            ))}

            {user ? (
              <li className="w-full">
                <div className="flex items-center gap-4 py-4">
                  <div className="w-12 h-12 bg-primary text-background rounded-full flex items-center justify-center font-bold text-lg">
                    {user.initial}
                  </div>
                  <div>
                    <p className="text-lg font-medium">{user.name}</p>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-darkGray hover:text-primary transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </li>
            ) : (
              <>
                <li className="w-full">
                  <button
                    onClick={() => {
                      openAuthModal("login")
                      setIsMenuOpen(false)
                      toggleBurger()
                    }}
                    className="w-full text-left underline underline-offset-8 transition-all hover:text-primary"
                  >
                    Login
                  </button>
                </li>
                <li className="w-full">
                  <button
                    onClick={() => {
                      openAuthModal("signup")
                      setIsMenuOpen(false)
                      toggleBurger()
                    }}
                    className="w-full bg-primary text-background px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all h-[56px] flex items-center justify-center text-base font-extralight"
                  >
                    Sign Up
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </FadeDown>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}
