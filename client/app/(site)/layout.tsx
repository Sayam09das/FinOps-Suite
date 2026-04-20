import Footer from "@/app/components/layout/Footer";
import Navbar from "@/app/components/layout/Navbar";
import BackToTop from "@/app/components/layout/BackToTop";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
