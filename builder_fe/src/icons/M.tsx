import React, { FC } from 'react';

import { SVGProps } from '@/interfaces/common';

export const MobileIcon: FC<SVGProps> = ({ color = 'currentColor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
    width='100%'
    height='100%'
  >
    <path
      fill={color}
      d='M5.75 11.75a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75'
    />
    <path
      fill={color}
      fillRule='evenodd'
      d='M2.75 3.75a2.75 2.75 0 0 1 2.75-2.75h5a2.75 2.75 0 0 1 2.75 2.75v8.5a2.75 2.75 0 0 1-2.75 2.75h-5a2.75 2.75 0 0 1-2.75-2.75zm2.75-1.25c-.69 0-1.25.56-1.25 1.25v8.5c0 .69.56 1.25 1.25 1.25h5c.69 0 1.25-.56 1.25-1.25v-8.5c0-.69-.56-1.25-1.25-1.25h-.531c-.112.431-.503.75-.969.75h-2a1 1 0 0 1-.968-.75z'
    />
  </svg>
);
