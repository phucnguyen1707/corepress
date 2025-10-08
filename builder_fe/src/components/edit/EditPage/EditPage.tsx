'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import './editPage.scss';


export default function LoginPage() {
  const t = useTranslations('Login');


  return (
    <div className='edit-page'>
      <div className='first-section'>123</div>
      <div className='second-section'>123213</div>
    </div>  
  );
}
