import { NextRequest, NextResponse } from 'next/server';
import {
  BackendRequestError,
  createRouteErrorBody,
  proxyWithAuth,
  readApiEnvelope,
} from '@/lib/auth/server';
import type { PaginatedTransactions, Transaction } from '@/lib/api/types';

export async function GET(request: NextRequest) {
  try {
    const response = await proxyWithAuth(
      `/api/transactions${request.nextUrl.search}`,
      {
        method: 'GET',
      },
    );
    const payload = await readApiEnvelope<PaginatedTransactions>(response);

    if (response.status >= 500) {
      return NextResponse.json(
        payload ?? {
          success: false,
          message: 'Unable to load transactions right now.',
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      payload ?? {
        success: response.ok,
        message: response.ok
          ? 'Transactions loaded'
          : 'Unable to load transactions',
      },
      { status: response.status },
    );
  } catch (error) {
    return NextResponse.json(
      createRouteErrorBody(error, 'Unable to load transactions right now.'),
      {
        status: error instanceof BackendRequestError ? 200 : 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const response = await proxyWithAuth('/api/transactions', {
      method: 'POST',
      body: rawBody,
      headers: {
        'Content-Type':
          request.headers.get('content-type') || 'application/json',
      },
    });
    const payload = await readApiEnvelope<Transaction>(response);

    if (response.status >= 500) {
      return NextResponse.json(
        payload ?? {
          success: false,
          message: 'Unable to create transaction right now.',
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      payload ?? {
        success: response.ok,
        message: response.ok
          ? 'Transaction created'
          : 'Unable to create transaction',
      },
      { status: response.status },
    );
  } catch (error) {
    return NextResponse.json(
      createRouteErrorBody(error, 'Unable to create transaction right now.'),
      {
        status: error instanceof BackendRequestError ? 200 : 500,
      },
    );
  }
}
