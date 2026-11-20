import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, isGuest } = await req.json();

    if (isGuest) {
      const guestUser = {
        id: 'user-guest',
        email: 'guest@deepfact.ai',
        name: 'Guest Investigator',
        role: 'guest' as const,
        createdAt: new Date().toISOString(),
      };
      const res = NextResponse.json({ success: true, user: guestUser });
      res.cookies.set('deepfact_session', JSON.stringify(guestUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 86400 * 7,
      });
      return res;
    }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password. Hint: Use analyst@deepfact.ai / password123' },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true, user });
    res.cookies.set('deepfact_session', JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400 * 7,
    });
    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
