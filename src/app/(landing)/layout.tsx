import { ReactNode } from "react";

import "./globals.css";
import { createReactQueryClient } from "../../../reactQueryClient";
import { QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  const queryClient = createReactQueryClient();

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
