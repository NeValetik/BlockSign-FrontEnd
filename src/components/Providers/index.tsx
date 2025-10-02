"use client"

import { FC, ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { createReactQueryClient } from "../../../reactQueryClient";
import { UserContextProps, UserContextProvider } from "@/contexts/userContext";
import { TokenContextProvider } from "@/contexts/tokenContext";
import { Toaster } from "../Sonner";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { DocumentsContextProps, DocumentsContextProvider } from "@/contexts/documentsContext";

const Providers: FC<
  { 
    children: ReactNode, 
    locale: string, 
    token: string,
    session: Session | null,
    me: UserContextProps['me'],
    documents: DocumentsContextProps['documents'],
  }
> = (
  { 
    children, 
    locale, 
    token,
    session,
    me,
    documents,
  }
) => {
  const client = createReactQueryClient();
  // const me = null; 

  return (
    <CookiesProvider>
      <SessionProvider session={ session }>
        <LocaleProvider defaultLocale={ locale }>
          <UserContextProvider me={ me }>
            <TokenContextProvider token={ token }>
              <DocumentsContextProvider documents={ documents }>
                <QueryClientProvider client={ client }>
                  {children}
                  <Toaster />
                </QueryClientProvider>
              </DocumentsContextProvider>
            </TokenContextProvider>
          </UserContextProvider>
        </LocaleProvider>
      </SessionProvider>
    </CookiesProvider>
  )
}

export default Providers;