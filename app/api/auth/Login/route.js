// app/api/auth/Login/route.js

import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";
import cookie from "cookie";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Parse JSON body from the request
    const { email, password } = await req.json();

    // Basic validation: Ensure both email and password are provided
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required.", status: "error" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the user exists in the database (using model "users")
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found.", status: "error" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify the provided password against the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ message: "Invalid password.", status: "error" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate a JWT token with the user's ID
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Create a session cookie that stores the JWT token
    const sessionCookie = cookie.serialize(
      "user_session",
      token,
      {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript on the client side
        secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
        sameSite: "Strict", // Restricts the cookie to same-site requests only
        maxAge: 60 * 60 * 24 * 7, // Cookie expires in one week
        path: "/", // The cookie is available across the entire site
      }
    );

    // Return a successful response along with the session cookie
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
