// components/user-dropdown.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { User, LogOut, LayoutDashboard, Settings, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface UserDropdownProps {
  user: any
  initials: string
  displayName: string
  isAdmin: boolean
  onSignOut: () => void
  scrolled: boolean
}

export function UserDropdown({ 
  user, 
  initials, 
  displayName, 
  isAdmin, 
  onSignOut, 
  scrolled 
}: UserDropdownProps) {
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
        className={`rounded-full gap-2 transition-colors flex items-center ${
          scrolled 
            ? "text-gray-700 hover:text-primary" 
            : "text-white hover:bg-white/10"
        }`}
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden xl:inline">{displayName}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-gray-800">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
            </div>
            <div className="h-px bg-gray-100" />
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            {isAdmin && (
              <>
                <div className="h-px bg-gray-100" />
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Admin Panel
                </Link>
              </>
            )}
            <div className="h-px bg-gray-100" />
            <button
              onClick={() => {
                onSignOut()
                setIsOpen(false)
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors w-full text-left"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}