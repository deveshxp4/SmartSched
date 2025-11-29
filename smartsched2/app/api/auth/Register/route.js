import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Basic validation
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ message: "All fields are required." }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "User already exists." }),
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return new Response(
      JSON.stringify({ message: "User created successfully!" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
