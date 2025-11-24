'use client';

import React, { useState } from 'react';

import { login } from '@/axios/auth.service';
import { LoginUser } from '@/interfaces/auth.interface';
import { useRouter } from '@/navigation';
import { ROUTE_PATH } from '@/route';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import './loginPage.css';

export default function LoginPage() {
  const t = useTranslations('Login');
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const payload: LoginUser = { email, password };
    try {
      const res = await login(payload);

      if (res.status === 200 && res.statusText === 'OK') {
        router.push(ROUTE_PATH.edit);
      }
    } catch (err: unknown) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login failed');
      } else {
        setError('Login failed');
      }
      setLoading(false);
    }
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
              name='email'
              placeholder={t('emailPlaceholder')}
              required
            />
          </label>

          <label>
            {t('password')}
            <input
              type='password'
              name='password'
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

        {error && <p className='error-message'>{error}</p>}

        <p className='login-footer'>
          {t('noAccount')} <Link href='/register'>{t('createAccount')}</Link>
        </p>
      </div>
    </div>
  );
}
