// app/api/auth/Logout/route.js

import * as cookie from "cookie";

export async function POST(req) {
  try {
    // Expire the session cookie
    const logoutCookie = cookie.serialize('user_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      expires: new Date(0), // Set cookie expiration to the past
      path: '/',
    });

    return new Response(
      JSON.stringify({ message: "Logged out successfully" }),
      {
        status: 200,
        headers: {
          'Set-Cookie': logoutCookie,
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
