'use client'

import { LOCALES } from "@/constants/locales";
import { setCookie } from "@/utils/cookie";
import { createContext, FC, useContext, useMemo, useState } from "react"; 

export interface ILocaleContext {
  locale: string
  setLocale: ( locale: string ) => void
  locales: typeof LOCALES
  current: typeof LOCALES[ 0 ]
}

const LocaleContext = createContext<ILocaleContext> ({
  locale: 'en',
  setLocale: () => {},
  locales: LOCALES,
  current: LOCALES[ 0 ],
})

interface LocaleProviderProps {
  children: React.ReactNode;
  defaultLocale: string;
}

export const LocaleProvider: FC<LocaleProviderProps> = ({ children, defaultLocale = 'en' }) => {
  const [locale, setLocale] = useState(defaultLocale);

  const currentLocale = useMemo(
    () => LOCALES.find( ( l ) => l.key === locale ) || LOCALES[ 0 ],
    [locale],
  );

  const contextValue = useMemo( () => ( {
    locale,
    setLocale: ( newLocale: string ) => {
      if (newLocale === locale) return;
      
      setLocale( newLocale );
      try {
        setCookie( 'locale', newLocale, { expires: 365, path: '/' } );
      } catch ( e ) {
        console.error( 'Failed to change locale:', e );
      }
    },
    locales: LOCALES,
    current: currentLocale,
  } ), [locale, currentLocale] );
  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}