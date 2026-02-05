import React, { FC } from 'react';

import { SVGProps } from '@/interfaces/common';

export const PromoSessionIcon: FC<SVGProps> = ({ color = 'currentcolor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
    width='100%'
    height='100%'
  >
    <path
      fill={color}
      fillRule='evenodd'
      d='M2.5 3.5c0-.55.45-1 1-1h9c.55 0 1 .45 1 1v2a1.5 1.5 0 0 0 0 3v2c0 .55-.45 1-1 1h-9c-.55 0-1-.45-1-1v-2a1.5 1.5 0 0 0 0-3zm1 0v2.25a.75.75 0 0 1 0 1.5V10.5h9V7.25a.75.75 0 0 1 0-1.5V3.5z'
    />

    <path
      fill={color}
      d='M6 5.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5'
    />
    <path
      fill={color}
      d='M10 9a.75.75 0 1 0 0 1.5A.75.75 0 0 0 10 9'
    />
    <path
      fill={color}
      d='M6 10.5 10 5.5h1l-4 5z'
    />
  </svg>
);
