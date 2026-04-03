import { SignIn } from '@clerk/nextjs';
import { AuthShell } from '@/app/components/auth/auth-shell';

export default function SignInPage() {
  return (
    <AuthShell
      title="Sign in to your secure finance workspace."
      subtitle="Use Clerk's prebuilt sign-in flow to open a verified session, then continue into the protected dashboard."
      alternateLabel="Need an account?"
      alternateCta="Create one in a few seconds and start using the dashboard."
      alternateHref="/sign-up"
    >
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
        fallbackRedirectUrl="/dashboard"
      />
    </AuthShell>
  );
}
