import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PixelHQ AI",
  description: "Retro-futuristic AI workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-bg overflow-hidden">
        {children}
      </body>
    </html>
  );
}
