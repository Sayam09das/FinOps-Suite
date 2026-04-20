import { AppProvider } from "../providers/app-provider"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-full flex-col">
      <AppProvider>
        {children}
      </AppProvider>
    </div>
  );
}
