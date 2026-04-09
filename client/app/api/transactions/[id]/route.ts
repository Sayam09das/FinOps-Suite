import { NextRequest, NextResponse } from 'next/server';
import {
  BackendRequestError,
  createRouteErrorBody,
  proxyWithAuth,
  readApiEnvelope,
} from '@/lib/auth/server';
import type { Transaction } from '@/lib/api/types';

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

const resolveParams = async ({ params }: RouteContext) => await params;

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
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

    if (response.status >= 500) {
      return NextResponse.json(
        payload ?? {
          success: false,
          message: 'Unable to update transaction right now.',
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      payload ?? {
        success: response.ok,
        message: response.ok
          ? 'Transaction updated'
          : 'Unable to update transaction',
      },
      { status: response.status },
    );
  } catch (error) {
    return NextResponse.json(
      createRouteErrorBody(error, 'Unable to update transaction right now.'),
      {
        status: error instanceof BackendRequestError ? 200 : 500,
      },
    );
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await resolveParams(context);
    const response = await proxyWithAuth(`/api/transactions/${id}`, {
      method: 'DELETE',
    });
    const payload = await readApiEnvelope<null>(response);

    if (response.status >= 500) {
      return NextResponse.json(
        payload ?? {
          success: false,
          message: 'Unable to delete transaction right now.',
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      payload ?? {
        success: response.ok,
        message: response.ok
          ? 'Transaction deleted'
          : 'Unable to delete transaction',
      },
      { status: response.status },
    );
  } catch (error) {
    return NextResponse.json(
      createRouteErrorBody(error, 'Unable to delete transaction right now.'),
      {
        status: error instanceof BackendRequestError ? 200 : 500,
      },
    );
  }
}
