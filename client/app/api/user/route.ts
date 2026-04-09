import { NextResponse } from 'next/server';
import {
  BackendRequestError,
  createRouteErrorBody,
  proxyWithAuth,
  readApiEnvelope,
} from '@/lib/auth/server';
import type { CurrentUser } from '@/lib/api/types';

export async function GET() {
  try {
    const response = await proxyWithAuth('/api/user', {
      method: 'GET',
    });
    const payload = await readApiEnvelope<CurrentUser>(response);

    if (response.status >= 500) {
      return NextResponse.json(
        payload ?? {
          success: false,
          message: 'Unable to load profile right now.',
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      payload ?? {
        success: response.ok,
        message: response.ok ? 'Profile loaded' : 'Unable to load profile',
      },
      { status: response.status },
    );
  } catch (error) {
    return NextResponse.json(
      createRouteErrorBody(error, 'Unable to load profile right now.'),
      {
        status: error instanceof BackendRequestError ? 200 : 500,
      },
    );
  }
}
