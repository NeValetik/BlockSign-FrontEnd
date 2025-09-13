'use client';

import { useEffect, useState } from 'react';
import i18next from 'i18next';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';
import { useCookies } from 'react-cookie';
import resourcesToBackend from 'i18next-resources-to-backend';
import {
  getOptions, languages, cookieName,
} from './settings';

const runsOnServerSide = typeof window === 'undefined';
 
i18next
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (language: string, namespace: string): Promise<any> => import(`../../../public/locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    detection: { 
      order: ['cookie', 'htmlTag', 'navigator'],
      caches: ['cookie'],
      lookupCookie: cookieName,
    },
    preload: runsOnServerSide ? languages : [],
  }); 

export function useTranslation(lng?: string, ns?: string | string[], options?: object) {
  const [cookies, setCookie] = useCookies([cookieName]);
  const ret = useTranslationOrg(ns, options);
  const { i18n } = ret;
  
  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);
    
    // Update active language when i18n language changes
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (activeLng !== i18n.resolvedLanguage) {
        setActiveLng(i18n.resolvedLanguage);
      }
    }, [activeLng, i18n.resolvedLanguage]);
    
    // Change language when lng prop changes
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (lng && i18n.resolvedLanguage !== lng) {
        i18n.changeLanguage(lng);
      }
    }, [lng, i18n]);
    
    // Sync cookie when language changes
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (cookies.locale !== i18n.resolvedLanguage && i18n.resolvedLanguage) {
        setCookie(cookieName, i18n.resolvedLanguage, { path: '/' });
      }
    }, [i18n.resolvedLanguage, cookies.locale, setCookie]);
  }
  return ret;
}
