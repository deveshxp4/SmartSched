// app/api/auth/Register/route.js

import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Basic validation
    if (!name || !email || !password) {
      return new Response("All fields are required.", { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new Response("User already exists.", { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return new Response(JSON.stringify({ message: "User created successfully!" }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
