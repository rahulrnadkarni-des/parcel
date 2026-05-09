import type { Metadata } from "next";
import { Fira_Sans } from "next/font/google";
import "./globals.css";
import { NavigationProvider } from "@/lib/navigation";
import { PageTransition } from "@/components/PageTransition";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-fira-sans",
});

export const metadata: Metadata = {
  title: "Parcel. — Find your order at the pickup point",
  description: "A crowdsourced visual library of food delivery packaging for Bangalore.",
  openGraph: {
    title: "Parcel. — Find your order at the pickup point",
    description: "A crowdsourced visual library of food delivery packaging for Bangalore.",
    images: ["/assets/Social preview.png"],
  },
  icons: { icon: "/assets/Favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={firaSans.variable}>
      <body className="font-sans antialiased bg-white text-[#222] overflow-x-hidden">
        <NavigationProvider>
          <PageTransition>{children}</PageTransition>
        </NavigationProvider>
      </body>
    </html>
  );
}
