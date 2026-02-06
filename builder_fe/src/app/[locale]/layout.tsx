import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Locale } from '@/interfaces/common';
import '@/styles/globals.scss';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
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