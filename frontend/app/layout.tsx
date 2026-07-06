import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "MBBS Admission 2026-27 | Study MBBS in India & Abroad | MBBS Advisor",
  description:
    "ISO 9001:2015 Certified MBBS Admission Consultancy. Explore NMC & WHO approved medical colleges in Georgia, Russia, Kazakhstan, Kyrgyzstan, Uzbekistan, and India. Get free counseling and 100% admission support.",
  keywords:
    "MBBS admission 2026, study MBBS abroad, MBBS in Georgia, MBBS in Russia, MBBS in Kazakhstan, NMC approved medical colleges, NEET score MBBS, MBBS consultants",
  openGraph: {
    title: "MBBS Admission 2026-27 | India & Abroad | MBBS Advisor",
    description:
      "ISO 9001:2015 Certified MBBS Consultancy. Secure your medical seat in top universities globally. Get 100% direct admission support.",
    type: "website",
    locale: "en_IN",
    url: "https://www.mbbsadvisor.com",
    siteName: "MBBS Advisor",
    images: [
      {
        url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "MBBS Admission Consultancy",
      },
    ],
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://www.mbbsadvisor.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-bg-base text-text-dark selection:bg-primary-100 selection:text-primary-700">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
