"use client"

import { FC, ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { LocaleProvider } from "@/contexts/localeContext";
import { createReactQueryClient } from "../../../reactQueryClient";

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
  return (
    <LocaleProvider
      defaultLocale={ locale }
    >
      <QueryClientProvider client={client}>
        {children}
      </QueryClientProvider>
    </LocaleProvider>
  )
}

export default Providers;