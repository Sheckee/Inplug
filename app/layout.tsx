import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inplug Village",
  description: "A cozy isometric AI village -- every agent is a villager at work",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-bg overflow-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
