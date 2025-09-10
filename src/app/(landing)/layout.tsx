import { FC, ReactNode } from "react";

import "../globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/MainLayout/Header";
import Footer from "@/components/MainLayout/Footer";

const RootLayout:FC<{
  children: ReactNode;
}> = ({
  children,
}) =>{
  return (
    <html lang="en">
      <Providers>
        <Header />
        <body>
          {children}
        </body>
        <Footer />
      </Providers>
    </html>
  );
}

export default RootLayout;
