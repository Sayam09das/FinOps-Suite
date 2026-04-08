import { NextResponse } from 'next/server';
import { proxyWithAuth, readApiEnvelope } from '@/lib/auth/server';
import type { CurrentUser } from '@/lib/api/types';

export async function GET() {
  const response = await proxyWithAuth('/api/user', {
    method: 'GET',
  });
  const payload = await readApiEnvelope<CurrentUser>(response);

  return NextResponse.json(
    payload ?? {
      success: response.ok,
      message: response.ok ? 'Profile loaded' : 'Unable to load profile',
    },
    { status: response.status },
  );
}
