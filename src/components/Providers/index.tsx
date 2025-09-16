"use client"

import { FC, ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { createReactQueryClient } from "../../../reactQueryClient";
import { UserContextProvider } from "@/contexts/userContext";
import { TokenContextProvider } from "@/contexts/tokenContext";
import { Toaster } from "../Sonner";

const Providers: FC<
  { 
    children: ReactNode, 
    locale: string, 
    token: string,
  }
> = (
  { 
    children, 
    locale, 
    token,
  }
) => {
  const client = createReactQueryClient();
  // const me = null; 
  const meZaticika = {
    id: '1',
    profile: {
      email: 'test@test.com',
      fullName: 'Test Test',
      avatar: 'https://placehold.co/600x400',
      role: 'ADMIN',
      phone: {
        code: '+373',
        number: '1234567890',
      },
    },
  }
  return (
    <CookiesProvider>
      <LocaleProvider defaultLocale={ locale }>
        <UserContextProvider me={ meZaticika }>
          <TokenContextProvider token={ token }>
            <QueryClientProvider client={ client }>
              {children}
              <Toaster />
            </QueryClientProvider>
          </TokenContextProvider>
        </UserContextProvider>
      </LocaleProvider>
    </CookiesProvider>
  )
}

export default Providers;