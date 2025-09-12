import {
  createInstance, TFunction, i18n as I18nInstance,
} from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { getOptions } from './settings';

type InitI18next = (lng: string, ns: string | string[]) => Promise<I18nInstance>;
const initI18next: InitI18next = async (lng, ns) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`../../../public/locales/${language}/${namespace}.json`)))
    .init(getOptions(lng, Array.isArray(ns) ? ns.join(',') : ns));
  return i18nInstance;
};

interface UseTranslationOptions {
  keyPrefix?: string;
}

interface UseTranslationResult {
  t: TFunction;
  i18n: I18nInstance;
}

export async function useTranslation(
  lng: string,
  ns: string | string[],
  options: UseTranslationOptions = {},
): Promise<UseTranslationResult> {
  const i18nextInstance = await initI18next(lng, ns);

  return {
    t: await i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n: i18nextInstance,
  };
}
