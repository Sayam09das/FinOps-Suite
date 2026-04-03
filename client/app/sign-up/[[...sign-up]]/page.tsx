import { SignUp } from '@clerk/nextjs';
import { AuthShell } from '@/app/components/auth/auth-shell';

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your account and sync it to the FinOps backend."
      subtitle="New users are provisioned in Clerk first, then upserted into MongoDB on their first authenticated backend request."
      alternateLabel="Already have an account?"
      alternateCta="Jump straight back into the sign-in flow."
      alternateHref="/sign-in"
    >
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/dashboard"
        fallbackRedirectUrl="/dashboard"
      />
    </AuthShell>
  );
}
