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

  const response = NextResponse.json(
    {
      success: true,
      data: null,
      message: 'Logged out successfully',
    },
    { status: 200 },
  );

  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  return response;
}
