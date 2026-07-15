import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '@/styles/globals.scss';

// `locale` here must be typed as the plain `string` the route provides — Next 16 validates this
// layout's props against its generated `LayoutProps<"/[locale]">`, whose `params` is
// `Promise<{ locale: string }>`. Declaring it as the stricter `Locale` enum made the build fail,
// because a `string` is not assignable to the enum. NextIntlClientProvider accepts a string locale.
type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const RootLayout = async ({ children, params }: LayoutProps) => {
  const { locale } = await params;

  const messages = await getMessages();
 
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
    >
      {children}
    </NextIntlClientProvider>
  );
};

export default RootLayout;