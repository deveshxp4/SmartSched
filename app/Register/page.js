"use client"; // Ensure this is a client-side component
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";  // Import useRouter from next/navigation
import Link from "next/link";
import "./Style.css";  // Import CSS file

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [message, setMessage] = useState('');
  const [isClient, setIsClient] = useState(false);  // Track client-side rendering

  const router = useRouter();  // Move useRouter here, inside the component

  // Make sure to use useEffect only for client-side code
  useEffect(() => {
    setIsClient(true);  // Set isClient to true after mounting on the client
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(""); // Clear any previous messages before making a request

    try {
      const res = await fetch('/api/auth/Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 201) {
        // Success: Display success message and redirect
        setMessage("Registration successful! Please login.");
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else if (res.status === 409) {
        // User already exists: Show message and redirect to login
        setMessage("You are already registered! Please login instead.");
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        // Error: Display the backend error message
        setMessage(data.message || "Something went wrong!");
      }
    } catch (error) {
      // Handle network or unexpected errors
      setMessage("Failed to connect to the server. Please try again.");
    }
  };

  // for password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  // toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (!isClient) {
    return null;  // Render nothing while waiting for client-side mounting
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 md:px-8 lg:px-16 py-8 gap-8 lg:gap-16">
        <div className="w-full lg:w-1/2 flex justify-center">
          <img className="w-full max-w-md lg:max-w-lg" src="/image45.png" alt="Registration illustration" />
        </div>
        
        <div className="form1 w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div
                className={`p-3 rounded-lg text-center ${
                  message.includes("successful") 
                    ? "bg-green-50 text-green-800 border border-green-200" 
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Name</label>
            </div>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                viewBox="0 -9 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Layer_3" data-name="Layer 3">
                  <path
                    d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"
                  ></path>
                </g>
              </svg>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
            </div>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Layer_3" data-name="Layer 3">
                  <path
                    d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"
                  ></path>
                </g>
              </svg>
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
            </div>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                viewBox="-64 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"
                ></path>
                <path
                  d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"
                ></path>
              </svg>
              <input
                type={passwordVisible ? "text" : "password"}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? 
                  <img className="w-5 h-5" src="/eye.png" alt="Hide password" /> : 
                  <img className="w-5 h-5" src="/visible.png" alt="Show password" />
                }
              </button>
            </div>

            <button
              className="main relative px-8 py-3 rounded-md bg-black text-white w-full hover:bg-gray-800 transition-colors isolation-auto z-10 border-2 border-zinc-950 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-yellow-500 before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700"
            >
              Sign Up
            </button>

            <div className="text-center">
              <Link href={"/login"}>
                <p className="text-gray-600">
                  Already have an account? <span className="text-blue-600 hover:text-blue-800 font-medium">Login</span>
                </p>
              </Link>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                By signing up, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
