import { NextResponse } from 'next/server';
import { clearAuthCookies, requestBackend } from '@/lib/auth/server';

export async function POST() {
  try {
    await requestBackend('/api/auth/logout', {
      method: 'POST',
    });
  } catch {
    // The frontend cookie cleanup is the important part for this flow.
  }

  await clearAuthCookies();

  return NextResponse.json(
    {
      success: true,
      data: null,
      message: 'Logged out successfully',
    },
    { status: 200 },
  );
}
