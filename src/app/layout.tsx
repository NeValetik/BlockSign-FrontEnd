import { FC, ReactNode } from "react";
import { cookies } from "next/headers";
import { Metadata } from "next";
import { dir } from "i18next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: 'BlockSign - Secure Document Verification & Digital Signatures',
    template: '%s | BlockSign'
  },
  description: 'Blockchain-powered document authentication and digital signatures. Verify documents instantly using blockchain technology with military-grade encryption.',
  keywords: ['blockchain', 'digital signature', 'document verification', 'secure documents', 'blockchain authentication'],
  authors: [{ name: 'BlockSign' }],
  creator: 'BlockSign',
  publisher: 'BlockSign',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'BlockSign',
    title: 'BlockSign - Secure Document Verification & Digital Signatures',
    description: 'Blockchain-powered document authentication and digital signatures. Verify documents instantly using blockchain technology.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlockSign - Secure Document Verification & Digital Signatures',
    description: 'Blockchain-powered document authentication and digital signatures.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const RootLayout:FC<{
  children: ReactNode;
}> = async ({
  children,
}) => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('locale')?.value || 'en';
  return (
    <html lang="en" dir={dir(cookieLocale)}>
      <body>
        { children }
      </body>
    </html>
  );
}

export default RootLayout;
