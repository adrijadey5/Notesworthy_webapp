import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: 'Token not provided' }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  
  // Set the token in a cookie
  response.cookies.set('firebaseIdToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  return response;
}
