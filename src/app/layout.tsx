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
  title: 'NOCTURNE TATTOO HOUSE — Made to stay.',
  description: 'Custom tattooing from first thought to final line. An independent tattoo atelier for considered, personal work.',
  openGraph: { title: 'Nocturne Tattoo House — Made to stay.', description: 'Custom tattooing from first thought to final line.', images: [{ url: '/images/studio.webp', width: 1536, height: 1024 }] },
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: '#0D0C0B' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
