import React from 'react';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { Locale } from '@/interfaces/common';
import '@/styles/globals.scss';

type LayoutProps = {
  children: React.ReactNode;
  params: { locale: Locale };
};

const RootLayout = ({ children, params: { locale } }: LayoutProps) => {
  const messages = useMessages();
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
    >{children}
    </NextIntlClientProvider>
  );
};

export default RootLayout;
