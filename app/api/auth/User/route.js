// app/api/auth/User/route.js

import { prisma } from "../../../../lib/prisma";
import cookie from "cookie";

export async function GET(req) {
  try {
    // Parse cookies to get the session cookie
    const cookies = cookie.parse(req.headers.get('Cookie') || '');
    const session = cookies.user_session ? JSON.parse(cookies.user_session) : null;

    if (!session) {
      return new Response("Not authenticated", { status: 401 });
    }

    // Fetch user data using session.userId
    const user = await prisma.users.findUnique({
      where: {
        id: session.userId,
      },
    });

    if (!user) {
      return new Response("User not found.", { status: 404 });
    }

    // Return user data
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
