export const fallbackLng = 'en';
export const languages = [fallbackLng, 'ru', 'ro'];
export const defaultNS = 'common';
export const cookieName = 'locale';

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
