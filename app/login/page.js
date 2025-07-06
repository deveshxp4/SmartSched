"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./Style.css";

const Page = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (message) {
            setShowMessage(true);
            const timer = setTimeout(() => {
                setShowMessage(false);
                setMessage("");
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/auth/Login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.status === 200) {
                setMessage("Login successful!");
                
                // Store login status in localStorage
                localStorage.setItem("isLoggedIn", "true");
                
                // Dispatch event to notify Navbar of login change
                window.dispatchEvent(new Event("storage"));

                // Redirect to dashboard
                router.push("/dashboard");
            } else if (res.status === 404) {
                setMessage("User not found. Please register first.");
            } else if (res.status === 401) {
                setMessage("Invalid password. Please try again.");
            } else {
                setMessage(data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setMessage("An unexpected error occurred. Please try again.");
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 md:px-8 lg:px-16 py-8 gap-8 lg:gap-16">
                <div className="w-full lg:w-1/2 flex justify-center">
                    <img className="w-full max-w-md lg:max-w-lg" src="/image1.png" alt="Login illustration" />
                </div>
                
                <form className="form w-full max-w-md" onSubmit={handleSubmit}>
                    {showMessage && (
                        <div className="message-popup text-red-800 mb-4 p-3 bg-red-50 rounded-lg">
                            <p>{message}</p>
                        </div>
                    )}
                    
                    <div className="flex-column mb-4">
                        <label className="text-sm font-medium text-gray-700 mb-2">Email</label>
                    </div>
                    <div className="inputForm mb-6">
                        <input
                            type="email"
                            className="input w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex-column mb-4">
                        <label className="text-sm font-medium text-gray-700 mb-2">Password</label>
                    </div>
                    <div className="inputForm mb-6 relative">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            className="input w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                        >
                            {passwordVisible ? 
                                <img className="w-5 h-5" src={"/eye.png"} alt="Hide password" /> : 
                                <img className="w-5 h-5" src={"/visible.png"} alt="Show password" />
                            }
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="main relative px-8 py-3 rounded-md bg-black text-white w-full hover:bg-gray-800 transition-colors"
                    >
                        Log In
                    </button>
                    
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don&apos;t have an account?{" "}
                            <Link href="/Register" className="text-blue-600 hover:text-blue-800 font-medium">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Page;
