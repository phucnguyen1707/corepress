'use client';

import React from 'react';

import Typo from '@/components/commons/Typo';
import { ReturnIcon } from '@/icons/L';
import { useTranslations } from 'next-intl';

import './editPage.scss';

export default function LoginPage() {
  const t = useTranslations('Login');

  return (
    <div className='edit-page'>
      <div className='header-session'>
        <div className='left-session'>
          <div className='return-button'>
            <ReturnIcon />
          </div>
          <Typo>Website Name</Typo>
        </div>
      </div>
      <div className='first-section'>123</div>
      <div className='second-section'>123213</div>
    </div>
  );
}
