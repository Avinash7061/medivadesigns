import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mediva Designs — Handcrafted Mandala Paintings",
  description: "Discover stunning handcrafted mandala paintings. Each piece brings harmony, beauty, and spiritual energy to your space. Shop our collection of geometric, floral, spiritual, and modern mandala art.",
  keywords: "mandala, paintings, art, handcrafted, spiritual, geometric, floral, home decor",
  openGraph: {
    title: "Mediva Designs — Handcrafted Mandala Paintings",
    description: "Discover stunning handcrafted mandala paintings that bring harmony and beauty to your space.",
    url: "https://medivadesigns.shop",
    siteName: "Mediva Designs",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main style={{ minHeight: "100vh", paddingTop: "var(--header-height)" }}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
