export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="relative flex min-h-full flex-col">{children}</div>;
}
