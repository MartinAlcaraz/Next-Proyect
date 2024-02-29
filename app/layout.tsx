import './ui/global.css'
import { inter } from './ui/fonts';
import { Metadata } from 'next';

// Metadata Layout
// Setear el metadata en el layout funcion igual que el diseño de la pagina. 
// Las paginas heredan la metadata del layout
// Luego especificar cada metadata en cada pagina. 
// Robots: en las paginas como configuracion o con informacion sensible setaeat no index, no follow y no cache.

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
  keywords: ['React', 'Node', 'NextJs', 'TailwindCss', 'NextAuth', 'PostgreSQL', 'A. Martin Alcaraz'],
  creator: "A. Martin Alcaraz",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot:{
      index: true,
      follow: true,
      nocache: true,
      notranslate: true,
    }
  },
  verification: {
    google: "google",
    yandex: "yandex",
    yahoo: "yahoo",
    other: {
      me: ['martincho_cqc@hotmail.com', 'https://www.linkedin.com/in/angel-martin-alcaraz/'],
    },
  },

  openGraph: {
    title: 'Acme Dashboard',
    description: 'The official Next.js Course Dashboard, built with App Router.',
    url: 'https://nextjs.org',
    siteName: 'Acme.com',
    images: [
      {
        url: 'https://nextjs.org/og.png', // Must be an absolute URL
        width: 800,
        height: 600,
        alt: 'My custom alt'
      },
      {
        url: 'https://nextjs.org/og-alt.png', // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: 'My custom alt 2',
      },
    ],
    locale: 'es_AR',
    alternateLocale: 'es_LA',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Next.js',
    description: 'The React Framework for the Web',
    siteId: '1467726470533754880',
    creator: 'A. Martin Alcaraz',
    creatorId: '1467726470533754880',
    images: ['https://nextjs.org/og.png'], // Must be an absolute URL
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
