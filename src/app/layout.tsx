import type { Metadata, Viewport } from 'next';
import '../index.css';

export const viewport: Viewport = {
  themeColor: '#0A3D22',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Mushahid Hussain - Web Developer Portfolio',
  description: 'Professional Web & Full-Stack Developer portfolio of Mushahid Hussain featuring responsive projects, GitHub repositories, technical skills showcase, interactive resume, and contact channels.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mushahid Portfolio',
  },
  openGraph: {
    title: 'Mushahid Hussain - Web Developer Portfolio',
    description: 'Professional Web & Full-Stack Developer portfolio of Mushahid Hussain featuring responsive projects, GitHub repositories, technical skills showcase, interactive resume, and contact channels.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23C5A059' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2'/%3E%3Cpolyline points='12 22 12 12'/%3E%3Cpolyline points='22 8.5 12 12 2 8.5'/%3E%3Cpath d='M12 12L12 2'/%3E%3C/svg%3E" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400;1,600;1,700&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#F8F5EE] text-[#11261B] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
