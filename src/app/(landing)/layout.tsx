import { ReactNode } from "react";

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  // const isSSR = typeof window === 'undefined';
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
