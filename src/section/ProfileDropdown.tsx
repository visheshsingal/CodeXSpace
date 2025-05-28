"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, User, Settings, LogOut } from "lucide-react"

interface ProfileDropdownUser {
  name: string
  email: string
  initial: string
}

interface ProfileDropdownProps {
  user: ProfileDropdownUser
  onLogout: () => void
}

export default function ProfileDropdown({ user, onLogout }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-full bg-bgCard hover:bg-opacity-80 transition-all"
      >
        <div className="w-10 h-10 bg-primary text-background rounded-full flex items-center justify-center font-bold text-lg">
          {user.initial}
        </div>
        <span className="text-white font-medium hidden sm:block">{user.name}</span>
        <ChevronDown size={16} className={`text-lightGray transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-bgCard rounded-xl shadow-lg border border-borderGray overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-borderGray">
            <p className="text-white font-medium">{user.name}</p>
            <p className="text-darkGray text-sm">{user.email}</p>
          </div>

          <div className="py-2">
            <button className="w-full px-4 py-2 text-left text-lightGray hover:bg-background hover:text-white transition-colors flex items-center gap-3">
              <User size={16} />
              Profile
            </button>
            <button className="w-full px-4 py-2 text-left text-lightGray hover:bg-background hover:text-white transition-colors flex items-center gap-3">
              <Settings size={16} />
              Settings
            </button>
          </div>

          <div className="border-t border-borderGray py-2">
            <button
              onClick={onLogout}
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-background hover:text-red-300 transition-colors flex items-center gap-3"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
