'use client'

import { setCookie } from "@/utils/cookie";
import { createContext, FC, useContext, useMemo, useState } from "react";

const Locales = [
  {
    label: 'English',
    key: 'en',
  },
  {
    label: 'Русский',
    key: 'ru',
  },
  {
    label: 'Română',
    key: 'ro',
  },
];

export interface ILocaleContext {
  locale: string
  setLocale: ( locale: string ) => void
  locales: typeof Locales
  current: typeof Locales[ 0 ]
}

const LocaleContext = createContext<ILocaleContext> ({
  locale: 'en',
  setLocale: () => {},
  locales: Locales,
  current: Locales[ 0 ],
})

interface LocaleProviderProps {
  children: React.ReactNode;
  defaultLocale: string;
}

export const LocaleProvider: FC<LocaleProviderProps> = ({ children, defaultLocale = 'en' }) => {
  const [locale, setLocale] = useState(defaultLocale);

  const currentLocale = useMemo(
    () => Locales.find( ( l ) => l.key === locale ) || Locales[ 0 ],
    [locale],
  );

  const contextValue = useMemo( () => ( {
    locale,
    setLocale: ( newLocale: string ) => {
      // Prevent unnecessary updates
      if (newLocale === locale) return;
      
      setLocale( newLocale );
      try {
        // Set cookie synchronously for immediate effect
        setCookie( 'locale', newLocale, { expires: 365, path: '/' } );
        // Change i18next language
      } catch ( e ) {
        // @note: shouldn't be called on the server, but just in case
         
        console.error( 'Failed to change locale:', e );
      }
    },
    locales: Locales,
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