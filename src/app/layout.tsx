import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import "./globals.css";
import { NavigationProvider } from "@/lib/navigation";
import { PageTransition } from "@/components/PageTransition";
import { Analytics } from "@vercel/analytics/next";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-fira-sans",
});

export const metadata: Metadata = {
  title: "Parcel. — Is that your food? Let's find out.",
  description: "A crowdsourced visual library of food delivery packaging for Bangalore.",
  openGraph: {
    title: "Parcel. — Is that your food? Let's find out.",
    description: "A crowdsourced visual library of food delivery packaging for Bangalore.",
    images: [{ url: "/assets/Social preview.png", width: 2400, height: 1200 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parcel. — Is that your food? Let's find out.",
    description: "A crowdsourced visual library of food delivery packaging for Bangalore.",
    images: ["/assets/Social preview.png"],
  },
  icons: {
    icon: "/assets/Favicon.png",
    apple: "/assets/Favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={firaSans.variable}>
      <body className="font-sans antialiased bg-white text-[#222] overflow-x-hidden">
        <NavigationProvider>
          <PageTransition>{children}</PageTransition>
        </NavigationProvider>
        <Analytics />
      </body>
    </html>
  );
}
