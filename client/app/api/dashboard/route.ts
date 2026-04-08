import { NextResponse } from 'next/server';
import { proxyWithAuth, readApiEnvelope } from '@/lib/auth/server';
import type { DashboardData } from '@/lib/api/types';

export async function GET() {
  const response = await proxyWithAuth('/api/dashboard', {
    method: 'GET',
  });
  const payload = await readApiEnvelope<DashboardData>(response);

  return NextResponse.json(
    payload ?? {
      success: response.ok,
      message: response.ok ? 'Dashboard loaded' : 'Unable to load dashboard',
    },
    { status: response.status },
  );
}
