import { getRequestConfig } from 'next-intl/server';

import { Locale } from '@/interfaces/common';
import { locales } from '@/navigation';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the new async requestLocale
  let locale = await requestLocale;

  // Ensure the locale is valid
  if (!locale || !locales.includes(locale as Locale)) {
    // You can either:
    // Option 1: Set a fallback
    locale = 'en'; // or whatever your default locale is

    // Option 2: Or throw notFound() if you prefer strict validation
    notFound();
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
