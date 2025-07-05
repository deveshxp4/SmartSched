"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // Function to check login status and get user data
        const checkLoginStatus = async () => {
            try {
                const response = await fetch("/api/auth/User");
                if (response.ok) {
                    const userData = await response.json();
                    setIsLoggedIn(true);
                    setUserName(userData.name || "User");
                    localStorage.setItem("isLoggedIn", "true");
                } else {
                    setIsLoggedIn(false);
                    setUserName("");
                    localStorage.removeItem("isLoggedIn");
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                setIsLoggedIn(false);
                setUserName("");
                localStorage.removeItem("isLoggedIn");
            }
        };

        checkLoginStatus();

        // Listen for login changes
        window.addEventListener("storage", checkLoginStatus);
        window.addEventListener("focus", checkLoginStatus);

        return () => {
            window.removeEventListener("storage", checkLoginStatus);
            window.removeEventListener("focus", checkLoginStatus);
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.dropdown-container')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleLogout = async () => {
        try {
            // Call the logout API to clear server-side session
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            // Clear client-side storage
            localStorage.removeItem("isLoggedIn");
            setIsLoggedIn(false);
            setUserName("");
            setShowDropdown(false);
            
            // Redirect to home page
            router.push("/");
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local storage even if API call fails
            localStorage.removeItem("isLoggedIn");
            setIsLoggedIn(false);
            setUserName("");
            setShowDropdown(false);
            router.push("/");
        }
    };

    return (
        <div className="m-5 p-5 flex justify-between items-center bg-white shadow-sm rounded-lg">
            <div className="flex items-center">
                <Link href={"/"}>
                    <div className="flex items-center gap-2">
                        <svg
                            className="logo w-8 h-8"
                            viewBox="0 0 200 200"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M158.026 23.5H41.974C31.771 23.5 23.5 31.771 23.5 41.974v116.052c0 10.203 8.271 18.474 18.474 18.474h116.052c10.203 0 18.474-8.271 18.474-18.474V41.974c0-10.203-8.271-18.474-18.474-18.474zM62.37 125.347c-8.382 1.206-16.154-4.611-17.36-12.992s4.611-16.154 12.992-17.36c8.382-1.206 16.154 4.611 17.36 12.992s-4.61 16.154-12.992 17.36zm89.787-43.89-47.193 63.061a14.978 14.978 0 0 1-12.021 6.014c-3.127 0-6.279-.974-8.976-2.992-6.633-4.964-7.985-14.364-3.022-20.997l47.193-63.061c4.964-6.633 14.363-7.985 20.997-3.022 6.632 4.964 7.985 14.365 3.022 20.997z"
                                fill="#111010"
                            />
                        </svg>
                        <span className="text-xl font-bold text-gray-800">SmartSched</span>
                    </div>
                </Link>
            </div>
            
            <div className="flex items-center gap-6">
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className={`text-gray-600 hover:text-gray-900 transition-colors ${pathname === '/' ? 'text-blue-600 font-medium' : ''}`}>
                        Home
                    </Link>
                    {isLoggedIn && (
                        <>
                            <Link href="/dashboard" className={`text-gray-600 hover:text-gray-900 transition-colors ${pathname === '/dashboard' ? 'text-blue-600 font-medium' : ''}`}>
                                Dashboard
                            </Link>
                            <Link href="/timetable" className={`text-gray-600 hover:text-gray-900 transition-colors ${pathname === '/timetable' ? 'text-blue-600 font-medium' : ''}`}>
                                Timetable
                            </Link>
                        </>
                    )}
                    <Link href="/CleanCity" className={`text-gray-600 hover:text-gray-900 transition-colors ${pathname === '/CleanCity' ? 'text-blue-600 font-medium' : ''}`}>
                        Clean City
                    </Link>
                </nav>

                {isLoggedIn ? (
                    <div className="relative dropdown-container">
                        <div 
                            className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                    {userName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{userName}</span>
                            <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Dashboard
                                </Link>
                                <Link href="/changepassword" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Change Password
                                </Link>
                                <hr className="my-1" />
                                <button 
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <button className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors">
                                Login
                            </button>
                        </Link>
                        <Link href="/Register">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
