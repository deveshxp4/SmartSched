// app/api/auth/User/route.js
import prisma from '../../../../lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    // Get the session cookie
    const cookieStore = cookies();
    const userSession = cookieStore.get('user_session');

    if (!userSession || !userSession.value) {
      return Response.json(
        { authenticated: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify the JWT token
    try {
      const decoded = jwt.verify(userSession.value, process.env.JWT_SECRET || 'fallback_secret');

      // Get user data
      const user = await prisma.users.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          email: true
        }
      });

      if (!user) {
        return Response.json(
          { authenticated: false, error: "User not found" },
          { status: 404 }
        );
      }

      return Response.json(user);
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return Response.json(
        { authenticated: false, error: "Invalid session" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return Response.json(
      { authenticated: false, error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}