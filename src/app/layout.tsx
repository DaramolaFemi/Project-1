import type { Metadata, Viewport } from 'next';
import '@fontsource/bodoni-moda/latin-400.css';
import '@fontsource/bodoni-moda/latin-400-italic.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: { icon: '/icon.svg' },
  title: 'Nocturne Tattoo House — Give it a place.',
  description: 'Personal tattoos, made with you. See the work, meet the artists, and tell us the idea you keep returning to.',
  openGraph: { title: 'Nocturne Tattoo House — Give it a place.', description: 'Personal tattoos, made with you. From first thought to final line.', images: [{ url: '/images/studio.webp', width: 1536, height: 1024 }] },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: '#17211B' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
