import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the cookie
  response.cookies.set('firebaseIdToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: -1,
    path: '/',
  });

  return response;
}
