// app/api/auth/Login/route.js

import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import cookie from "cookie";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Basic validation
    if (!email || !password) {
      return new Response("Email and password are required.", { status: 400 });
    }

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return new Response("User not found.", { status: 404 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response("Invalid password.", { status: 401 });
    }

    // Create a session (store the user ID in a cookie)
    const sessionCookie = cookie.serialize('user_session', JSON.stringify({ userId: user.id }), {
      httpOnly: true, // Prevents access to the cookie via JavaScript
      secure: process.env.NODE_ENV === 'production', // Only set secure cookies in production
      sameSite: 'Strict', // Cookies will be sent for same-site requests only
      maxAge: 60 * 60 * 24 * 7, // Cookie expires in 1 week
      path: '/', // Cookie available site-wide
    });

    // Send the cookie with the response
    return new Response(
      JSON.stringify({ message: "Login successful!", user: { id: user.id, name: user.name, email: user.email } }),
      {
        status: 200,
        headers: {
          'Set-Cookie': sessionCookie,
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
