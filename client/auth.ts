import NextAuth from 'next-auth';
import type { Provider } from '@auth/core/providers';
import Apple from 'next-auth/providers/apple';
import Facebook from 'next-auth/providers/facebook';
import Google from 'next-auth/providers/google';
import {
  appleClientId,
  appleClientSecret,
  facebookClientId,
  facebookClientSecret,
  googleClientId,
  googleClientSecret,
  nextAuthSecret,
} from '@/lib/env';
import { exchangeOAuthWithBackend } from '@/lib/auth/server';
import type { OAuthProvider } from '@/lib/api/types';

const providers = [
  googleClientId && googleClientSecret
    ? Google({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      })
    : null,
  appleClientId && appleClientSecret
    ? Apple({
        clientId: appleClientId,
        clientSecret: appleClientSecret,
      })
    : null,
  facebookClientId && facebookClientSecret
    ? Facebook({
        clientId: facebookClientId,
        clientSecret: facebookClientSecret,
      })
    : null,
].filter((provider) => provider !== null) as Provider[];

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: nextAuthSecret,
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 10,
  },
  providers,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (
        !account ||
        !user.email ||
        !['google', 'apple', 'facebook'].includes(account.provider)
      ) {
        return true;
      }

      try {
        await exchangeOAuthWithBackend(
          {
            email: user.email,
            name: user.name ?? user.email.split('@')[0],
            provider: account.provider as OAuthProvider,
            providerId: account.providerAccountId || user.email,
          },
          { persistCookies: true },
        );
      } catch (error) {
        console.error('OAuth bridge failed in signIn callback', error);
        return '/login?error=oauth_bridge';
      }

      return true;
    },

    async jwt({ token, account }) {
      if (account && ['google', 'apple', 'facebook'].includes(account.provider)) {
        const nextToken = token as typeof token & {
          oauthProvider?: OAuthProvider;
          providerId?: string;
        };

        nextToken.oauthProvider = account.provider as OAuthProvider;
        nextToken.providerId = account.providerAccountId;
      }

      return token;
    },

    async session({ session, token }) {
      const sessionUser = session.user as typeof session.user & {
        provider?: OAuthProvider;
        providerId?: string;
      };
      const typedToken = token as typeof token & {
        oauthProvider?: OAuthProvider;
        providerId?: string;
      };

      sessionUser.provider = typedToken.oauthProvider;
      sessionUser.providerId = typedToken.providerId;

      return session;
    },
  },
});
