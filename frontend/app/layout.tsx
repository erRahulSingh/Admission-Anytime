import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Admission Anytime | Higher Education Admission & Counselling Platform 2026",
  description:
    "Admissions Open 2026. Get expert counselling and admission guidance for MBBS, Engineering, Management, Computer Science, Nursing, Pharmacy, Law, and Study Abroad programs in India and internationally.",
  keywords:
    "Admission in India, Study Abroad, MBBS Abroad, MBBS Admission, Engineering Admission, Direct Admission, University Admission, College Admission, Career Counselling, Education Consultant, Overseas Education, Medical Admission, B.Tech Admission, MBA Admission, BCA Admission, MCA Admission, Nursing Admission, Pharmacy Admission, Scholarship Guidance, Visa Assistance, Best Education Consultant, Admission Consultant India, Higher Education Admission, International University Admission, Apply for College Admission, Admissions Open 2026",
  openGraph: {
    title: "Admission Anytime | Higher Education Admission & Counselling Platform",
    description:
      "Your Future Starts Here. Expert counselling and admission guidance for top universities in India & Abroad. Secure your seat today.",
    type: "website",
    locale: "en_IN",
    url: "https://www.admissionanytime.com",
    siteName: "Admission Anytime",
    images: [
      {
        url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Admission Anytime Consultancy",
      },
    ],
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://www.admissionanytime.com",
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
