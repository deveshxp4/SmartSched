'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, User, LogOut } from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This would come from your auth logic

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center">
              <span className="text-white text-lg font-bold">CC</span>
            </div>
            <span className="text-xl font-heading font-bold text-gray-900">CleanCity</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-700 font-medium">
              Home
            </Link>
            <Link href="/campaigns" className="text-gray-700 hover:text-primary-700 font-medium">
              Campaigns
            </Link>
            <Link href="/rewards" className="text-gray-700 hover:text-primary-700 font-medium">
              Rewards
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-700 font-medium">
              About Us
            </Link>
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-primary-700">
                  <User size={20} />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={() => setIsLoggedIn(false)} 
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-gray-700 hover:text-primary-700 font-medium">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <Link href="/" className="text-gray-700 hover:text-primary-700 font-medium py-2" onClick={toggleMenu}>
              Home
            </Link>
            <Link href="/campaigns" className="text-gray-700 hover:text-primary-700 font-medium py-2" onClick={toggleMenu}>
              Campaigns
            </Link>
            <Link href="/rewards" className="text-gray-700 hover:text-primary-700 font-medium py-2" onClick={toggleMenu}>
              Rewards
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-700 font-medium py-2" onClick={toggleMenu}>
              About Us
            </Link>
            
            <div className="border-t border-gray-100 pt-4 mt-2">
              {isLoggedIn ? (
                <div className="flex flex-col space-y-3">
                  <Link href="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-primary-700 py-2" onClick={toggleMenu}>
                    <User size={20} />
                    <span>Dashboard</span>
                  </Link>
                  <button 
                    onClick={() => {
                      setIsLoggedIn(false)
                      toggleMenu()
                    }} 
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 py-2"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link href="/login" className="btn btn-secondary w-full justify-center" onClick={toggleMenu}>
                    Login
                  </Link>
                  <Link href="/register" className="btn btn-primary w-full justify-center" onClick={toggleMenu}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar 