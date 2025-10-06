import {createNavigation} from 'next-intl/navigation';

import { Locale } from './interfaces/common';

export const locales = Object.values(Locale);
export const localePrefix = 'never';

export const { Link, redirect, usePathname, useRouter } = createNavigation({ locales, localePrefix });
