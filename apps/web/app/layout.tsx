import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/global/providers";
import { Navbar } from "@/components/global/navbar";

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "500",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontMono.variable} antialiased`}>
        <Providers>
          <Toaster />
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
