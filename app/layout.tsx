import { Press_Start_2P, Inter } from 'next/font/google';

const pixelFont = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-pixel' });
const sansFont = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${pixelFont.variable} ${sansFont.variable} antialiased min-h-screen bg-bg overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
