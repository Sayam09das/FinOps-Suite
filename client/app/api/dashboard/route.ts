import { NextResponse } from 'next/server';
import {
  BackendRequestError,
  createRouteErrorBody,
  proxyWithAuth,
  readApiEnvelope,
} from '@/lib/auth/server';
import type { DashboardData } from '@/lib/api/types';

export async function GET() {
  try {
    const response = await proxyWithAuth('/api/dashboard', {
      method: 'GET',
    });
    const payload = await readApiEnvelope<DashboardData>(response);

    if (response.status >= 500) {
      return NextResponse.json(
        payload ?? {
          success: false,
          message: 'Unable to load dashboard right now.',
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      payload ?? {
        success: response.ok,
        message: response.ok ? 'Dashboard loaded' : 'Unable to load dashboard',
      },
      { status: response.status },
    );
  } catch (error) {
    return NextResponse.json(
      createRouteErrorBody(error, 'Unable to load dashboard right now.'),
      {
        status: error instanceof BackendRequestError ? 200 : 500,
      },
    );
  }
}
