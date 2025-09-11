"use client"

import { FC, ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { createReactQueryClient } from "../../../reactQueryClient";
import { UserContextProvider } from "@/contexts/userContext";

const Providers: FC<
  { 
    children: ReactNode, 
    locale: string, 
  }
> = (
  { 
    children, 
    locale, 
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
      role: 'admin',
    },
  }
  return (
    <LocaleProvider
      defaultLocale={ locale }
    >
      <UserContextProvider me={meZaticika}>
        <QueryClientProvider client={client}>
          {children}
        </QueryClientProvider>
      </UserContextProvider>
    </LocaleProvider>
  )
}

export default Providers;