import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { exchangeOAuthWithBackend } from '@/lib/auth/server';
import type { OAuthProvider } from '@/lib/api/types';

type OAuthSessionUser = {
  email?: string | null;
  name?: string | null;
  provider?: OAuthProvider;
  providerId?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as {
    provider?: OAuthProvider;
  };
  const session = await auth();
  const user = session?.user as OAuthSessionUser | undefined;
  const provider = user?.provider ?? body.provider;

  if (!session?.user?.email || !provider) {
    return NextResponse.json(
      {
        success: false,
        message: 'OAuth session was not available. Please try again.',
      },
      { status: 401 },
    );
  }

  try {
    const authUser = await exchangeOAuthWithBackend({
      email: session.user.email,
      name: user?.name ?? session.user.email.split('@')[0],
      provider,
      providerId: user?.providerId ?? session.user.email,
    });

    return NextResponse.json(
      {
        success: true,
        data: authUser,
        message: 'OAuth sign-in completed successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'OAuth sign-in could not be completed.',
      },
      { status: 500 },
    );
  }
}
