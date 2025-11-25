'use client';

import React, { useState } from 'react';

import { register } from '@/axios/auth.service';
import { RegisterUser } from '@/interfaces/auth.interface';
import { useRouter } from '@/navigation';
import { ROUTE_PATH } from '@/route';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import './registerPage.css';

export default function RegisterPage() {
  const t = useTranslations('Register');
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const name = formData.get('name') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const payload: RegisterUser = { email, name, password };
    try {
      const res = await register(payload);
      if (res.status === 201) {
        router.push(ROUTE_PATH.login);
      }
    } catch (err: unknown) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Registration failed');
      } else {
        setError('Registration failed');
      }
      setLoading(false);
    }
  };
  return (
    <div className='register-page'>
      <div className='register-bg' />
      <div className='register-card'>
        <h1>{t('title')}</h1>

        <form onSubmit={handleRegister}>
          <label>
            {t('name')}
            <input
              type='name'
              name='name'
              placeholder={t('namePlaceholder')}
              required
            />
          </label>

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

          <label>
            {t('confirmPassword')}
            <input
              type='password'
              name='confirmPassword'
              placeholder={t('confirmPasswordPlaceholder')}
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

        <p className='register-footer'>
          {t('haveAccount')} <Link href='/login'>{t('login')}</Link>
        </p>
      </div>
    </div>
  );
}
