'use client';

import React, { useState } from 'react';

import { useRouter } from '@/navigation';
import { ROUTE_PATH } from '@/route';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import './loginPage.css';

export default function LoginPage() {
  const t = useTranslations('Login');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(ROUTE_PATH.edit);
    }, 1200);
  };

  return (
    <div className='login-page'>
      <div className='login-bg' />
      <div className='login-card'>
        <h1>{t('title')}</h1>

        <form onSubmit={handleLogin}>
          <label>
            {t('email')}
            <input
              type='email'
              placeholder={t('emailPlaceholder')}
              required
            />
          </label>

          <label>
            {t('password')}
            <input
              type='password'
              placeholder={t('passwordPlaceholder')}
              required
            />
          </label>

          <button
            type='submit'
            disabled={loading}
          >
            {loading ? <span className='spinner' /> : t('button')}
          </button>
        </form>

        <p className='login-footer'>
          {t('noAccount')} <Link href='/register'>{t('createAccount')}</Link>
        </p>
      </div>
    </div>
  );
}
