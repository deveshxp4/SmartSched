"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import "./Style.css";

const Page = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/auth/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.status === 200) {
            setMessage('Login successful!');
            router.push('/dashboard'); // You can modify this to redirect to a different page
        } else {
            setMessage(data.message);
        }
    };

    return (
        <>
            <div className='flex main100 gap-28'>
                <div>
                    <img className='main266' src='/image1.png' alt="Image"/>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="flex-column">
                        <label>Email</label>
                    </div>
                    <div className="inputForm">
                        <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg">
                            <g id="Layer_3" data-name="Layer 3">
                                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
                            </g>
                        </svg>
                        <input
                            type="email"
                            className="input"
                            placeholder="Enter your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex-column">
                        <label>Password</label>
                    </div>
                    <div className="inputForm">
                        <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
                            <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
                        </svg>
                        <input
                            type="password"
                            className="input"
                            placeholder="Enter your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex-row">
                        <div>
                            <input type="checkbox" />
                            <label className='ml-5'>Remember me</label>
                        </div>
                        <Link href="/changepassword">
                            <span className="span">Forgot password?</span>
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="main relative px-8 py-2 rounded-md bg-black text-white isolation-auto z-10 border-2 border-zinc-950
                        before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full  before:bg-yellow-500 before:-z-10  before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700"
                        style={{ width: '100%' }}
                    >
                        Log In
                    </button>

                    <Link href="/Register">
                        <p className="p">Don't have an account? <span className="span">Sign Up</span></p>
                    </Link>

                    <p className="p line">Or With</p>

                    <div className="flex-row">
                        <button className="btn google">
                            <svg
                                version="1.1"
                                width="20"
                                id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                x="0px"
                                y="0px"
                                viewBox="0 0 512 512"
                                style={{ enableBackground: "new 0 0 512 512" }}
                                xmlSpace="preserve"
                            >
                                <path
                                    style={{ fill: "#FBBB00" }}
                                    d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
                                    c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
                                    C103.821,274.792,107.225,292.797,113.47,309.408z"
                                ></path>
                                <path
                                    style={{ fill: "#518EF8" }}
                                    d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
                                    c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
                                    c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
                                ></path>
                                <path
                                    style={{ fill: "#28B446" }}
                                    d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
                                    c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
                                    c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
                                ></path>
                                <path
                                    style={{ fill: "#F14336" }}
                                    d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
                                    c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
                                    C318.115,0,375.068,22.126,419.404,58.936z"
                                ></path>
                            </svg>
                            Google
                        </button>

                        <button className="btn apple">
                            <svg
                                version="1.1"
                                height="20"
                                width="20"
                                id="Capa_1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                viewBox="0 0 55.231 55.231"
                            >
                                <g>
                                    <g>
                                        <path
                                            d="M39.031,23.342c-0.648,0-1.295,0.092-1.917,0.271c-0.47-0.749-1.07-1.377-1.746-1.9
                                            c0.711-0.917,1.235-2.065,1.235-3.347c0-2.64-2.12-5.345-5.443-5.345c-3.602,0-5.648,2.878-5.648,5.721
                                            c0,0.346,0.036,0.676,0.106,0.998c-4.062-0.202-7.734-3.332-7.734-7.64c0-4.246,3.37-7.775,7.544-7.775
                                            c2.282,0,4.446,1.157,5.808,2.94c1.28-0.262,2.539-0.667,3.768-1.22c-0.457-2.603-2.406-4.652-4.98-4.652
                                            c-3.437,0-6.248,2.673-6.248,6.248c0,2.115,1.014,4.004,2.545,5.283C37.564,23.022,38.309,23.342,39.031,23.342z"
                                        />
                                    </g>
                                </g>
                            </svg>
                            Apple
                        </button>
                    </div>

                    {message && <p className="error-message">{message}</p>}
                </form>
            </div>
        </>
    );
};

export default Page;
