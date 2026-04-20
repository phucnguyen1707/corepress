import React, { FC } from 'react';

import { SVGProps } from '@/interfaces/common';

export const EyeIcon: FC<SVGProps> = ({ color = 'currentcolor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='100%'
    height='100%'
    fill='none'
    stroke={color}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
    <circle cx='12' cy='12' r='3' />
  </svg>
);

export const EyeOffIcon: FC<SVGProps> = ({ color = 'currentcolor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='100%'
    height='100%'
    fill='none'
    stroke={color}
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.77 19.77 0 0 1 5.17-6.27' />
    <path d='M22.54 15.04A20.07 20.07 0 0 0 23 12s-4-8-11-8a11 11 0 0 0-3.7.65' />
    <path d='M1 1l22 22' />
    <path d='M9.88 9.88a3 3 0 1 0 4.24 4.24' />
  </svg>
);

export const EditIcon: FC<SVGProps> = ({ color = 'currentcolor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
    width='100%'
    height='100%'
  >
    <path
      fill={color}
      fillRule='evenodd'
      d='M13.655 2.344a2.694 2.694 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.009.01-5.88 5.88a2.75 2.75 0 0 0-.806 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.54a2.694 2.694 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88zm2.75.629.599-.599a1.196 1.196 0 0 0-1.69-1.69l-.598.6z'
    ></path>
  </svg>
);
