import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { AccessProvider } from '@/lib/access-context';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Hidden AI Tools - Discover the Best Secret AI Tools & Prompts',
  verification: {
    google: 'ns85BK8_72c2u1IZHzzW9z_o1xImAZ3ZdWC9DiT27rk',
  },
  description:
    'Find the best hidden AI tools, secret AI directories, and lifetime access to productivity tools curated by Hidden AI Tools.',
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    'hidden AI tools',
    'undiscovered AI tools',
    'secret prompts',
    'AI workflows',
    'cartoon AI',
    '3D AI',
    'voice cloning',
    'automation bots',
  ],
  openGraph: {
    title: 'Hidden AI Tools - Discover Undiscovered AI Tools, Secret Prompts & Workflows',
    description:
      'The secret vault of undiscovered AI tools and 4K workflows. Unlock 10,000+ hidden AI tools and secret prompts with a one-time $20 Lifetime Pass.',
    siteName: 'Hidden AI Tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hidden AI Tools',
    description:
      'The secret vault of undiscovered AI tools and 4K workflows.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AccessProvider>{children}</AccessProvider>
        <Toaster />
      </body>
    </html>
  );
}
