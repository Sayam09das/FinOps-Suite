import { NextRequest, NextResponse } from 'next/server';
import { proxyWithAuth, readApiEnvelope } from '@/lib/auth/server';
import type { PaginatedTransactions, Transaction } from '@/lib/api/types';

export async function GET(request: NextRequest) {
  const response = await proxyWithAuth(
    `/api/transactions${request.nextUrl.search}`,
    {
      method: 'GET',
    },
  );
  const payload = await readApiEnvelope<PaginatedTransactions>(response);

  return NextResponse.json(
    payload ?? {
      success: response.ok,
      message: response.ok
        ? 'Transactions loaded'
        : 'Unable to load transactions',
    },
    { status: response.status },
  );
}

export async function POST(request: NextRequest) {
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

  return NextResponse.json(
    payload ?? {
      success: response.ok,
      message: response.ok
        ? 'Transaction created'
        : 'Unable to create transaction',
    },
    { status: response.status },
  );
}
