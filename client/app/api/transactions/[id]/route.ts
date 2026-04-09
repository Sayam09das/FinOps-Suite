import { NextRequest, NextResponse } from 'next/server';
import { proxyWithAuth, readApiEnvelope } from '@/lib/auth/server';
import type { Transaction } from '@/lib/api/types';

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

const resolveParams = async ({ params }: RouteContext) => await params;

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await resolveParams(context);
  const rawBody = await request.text();
  const response = await proxyWithAuth(`/api/transactions/${id}`, {
    method: 'PUT',
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
        ? 'Transaction updated'
        : 'Unable to update transaction',
    },
    { status: response.status },
  );
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  const { id } = await resolveParams(context);
  const response = await proxyWithAuth(`/api/transactions/${id}`, {
    method: 'DELETE',
  });
  const payload = await readApiEnvelope<null>(response);

  return NextResponse.json(
    payload ?? {
      success: response.ok,
      message: response.ok
        ? 'Transaction deleted'
        : 'Unable to delete transaction',
    },
    { status: response.status },
  );
}
