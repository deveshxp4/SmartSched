// app/api/auth/Login/route.js

import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import cookie from "cookie";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Basic validation
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required.", status: "error" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found.", status: "error" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ message: "Invalid password.", status: "error" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a session (store the user ID in a cookie)
    const sessionCookie = cookie.serialize(
      "user_session",
      JSON.stringify({ userId: user.id }),
      {
        httpOnly: true, // Prevents access to the cookie via JavaScript
        secure: process.env.NODE_ENV === "production", // Set secure cookies in production
        sameSite: "Strict", // Cookies sent for same-site requests only
        maxAge: 60 * 60 * 24 * 7, // Expires in 1 week
        path: "/", // Cookie available site-wide
      }
    );

    // Successful Login
    return new Response(
      JSON.stringify({
        message: "Login successful!",
        status: "success",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      }),
      {
        status: 200,
        headers: {
          "Set-Cookie": sessionCookie,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", status: "error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
