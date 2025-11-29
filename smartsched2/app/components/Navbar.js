"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Get current page path

const Navbar = () => {
    const pathname = usePathname(); // Get current page path
    const [loginKey, setLoginKey] = useState(0); // Force re-render key
    const [showDropdown, setShowDropdown] = useState(false); // Dropdown state

    // Get login status directly from localStorage on every render
    const isLoggedIn = typeof window !== 'undefined' ? localStorage.getItem("isLoggedIn") === "true" : false;

    // Function to check and update login status
    const checkLoginStatus = () => {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        // Force re-render by updating key
        setLoginKey(prev => prev + 1);
        return loggedIn;
    };

    useEffect(() => {
        // Listen for login changes from login page
        const handleStorageChange = (e) => {
            if (e.key === "isLoggedIn" || e.type === "storage") {
                checkLoginStatus();
            }
        };

        // Also listen for custom events
        const handleLoginChange = () => {
            checkLoginStatus();
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("loginStateChanged", handleLoginChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("loginStateChanged", handleLoginChange);
        };
    }, []);

    // Also check on pathname change (navigation)
    useEffect(() => {
        checkLoginStatus();
    }, [pathname]);

    const handleProfileClick = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        setShowDropdown(false); // Close dropdown
        // Force re-render by updating key
        setLoginKey(prev => prev + 1);
        // Dispatch events to notify other components of logout
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("loginStateChanged"));
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.profile-dropdown')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="m-5 p-5 flex justify-between items-center relative z-20">
            {/* Logo on the left */}
            <div className="flex items-center">
                <Link href="/">
                    <svg
                        className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
                        viewBox="0 0 200 200"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M158.026 23.5H41.974C31.771 23.5 23.5 31.771 23.5 41.974v116.052c0 10.203 8.271 18.474 18.474 18.474h116.052c10.203 0 18.474-8.271 18.474-18.474V41.974c0-10.203-8.271-18.474-18.474-18.474zM62.37 125.347c-8.382 1.206-16.154-4.611-17.36-12.992s4.611-16.154 12.992-17.36c8.382-1.206 16.154 4.611 17.36 12.992s-4.61 16.154-12.992 17.36zm89.787-43.89-47.193 63.061a14.978 14.978 0 0 1-12.021 6.014c-3.127 0-6.279-.974-8.976-2.992-6.633-4.964-7.985-14.364-3.022-20.997l47.193-63.061c4.964-6.633 14.363-7.985 20.997-3.022 6.632 4.964 7.985 14.365 3.022 20.997z"
                            fill="#111010"
                        />
                    </svg>
                </Link>
            </div>

            {/* Menu items on the right */}
            <div className="flex items-center">
                <ul className="flex gap-5 items-center">
                    <li className="mt-1">Home</li>
                    <li className="mt-1">Contacts</li>
                    <li className="mt-1">Notifications</li>

                    {isLoggedIn ? (
                        <div className="relative profile-dropdown ml-4">
                            <li className="w-8 h-8 cursor-pointer" onClick={handleProfileClick}>
                                <div className="flex items-center gap-1 h-full">
                                    <img src="/usericon.png" alt="User" />
                                    <img className="main w-4 h-4 self-end" src="/down.png" alt="Dropdown" />
                                </div>
                            </li>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Dashboard
                                    </Link>
                                    <Link href="/my-timetable" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        My Timetable
                                    </Link>
                                    <Link href="/daily-timetable" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Daily Tasks
                                    </Link>
                                    <div className="border-t border-gray-100"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login" className="ml-4">
                            <button className="relative px-8 py-2 rounded-md bg-white border-2 border-zinc-950 hover:bg-gray-50 transition-colors">
                                Login
                            </button>
                        </Link>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
