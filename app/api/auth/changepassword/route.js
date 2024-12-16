import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = await req.json();

    // Basic validation
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return new Response("All fields are required.", { status: 400 });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return new Response("New password and confirmation do not match.", { status: 400 });
    }

    // Ensure the new password meets certain criteria (e.g., length, complexity)
    if (newPassword.length < 8) {
      return new Response("New password must be at least 8 characters long.", { status: 400 });
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

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return new Response("Old password is incorrect.", { status: 401 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Success response
    return new Response(
      JSON.stringify({ message: "Password changed successfully!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
