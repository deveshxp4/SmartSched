'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send this to your API
    console.log('Subscribing email:', email)
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center">
                <span className="text-white text-lg font-bold">CC</span>
              </div>
              <span className="text-xl font-heading font-bold text-white">CleanCity</span>
            </Link>
            <p className="mt-4 text-gray-400">
              Join our mission to create cleaner, greener communities through citizen participation.
            </p>
            <div className="flex mt-6 space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/campaigns" className="text-gray-400 hover:text-white transition-colors">
                  Campaigns
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="text-gray-400 hover:text-white transition-colors">
                  Rewards
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="text-gray-400 hover:text-white transition-colors">
                  Become a Volunteer
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-gray-400 hover:text-white transition-colors">
                  Impact Reports
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest campaigns and initiatives.
            </p>
            {subscribed ? (
              <div className="p-3 bg-primary-800 rounded-lg text-white">
                Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="bg-gray-800 text-white placeholder-gray-400 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500 flex-grow"
                />
                <button 
                  type="submit" 
                  className="bg-primary-700 hover:bg-primary-800 rounded-r-lg px-3"
                  aria-label="Subscribe"
                >
                  <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-4">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} CleanCity. All rights reserved.
            </p>
            <div className="mt-3 md:mt-0">
              <ul className="flex space-x-4 text-sm text-gray-500">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 