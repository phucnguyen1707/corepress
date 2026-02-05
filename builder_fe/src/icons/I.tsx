import React, { FC } from 'react';

import { SVGProps } from '@/interfaces/common';

export const ImageSessionIcon: FC<SVGProps> = ({ color = 'currentcolor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
    width='100%'
    height='100%'
  >
    <path
      fill={color}
      d='M3 4.25c0-.69.56-1.25 1.25-1.25h2a.75.75 0 0 0 0-1.5h-2a2.75 2.75 0 0 0-2.75 2.75v2a.75.75 0 0 0 1.5 0z'
    />
    <path
      fill={color}
      d='M11.75 3c.69 0 1.25.56 1.25 1.25v2a.75.75 0 0 0 1.5 0v-2a2.75 2.75 0 0 0-2.75-2.75h-2a.75.75 0 0 0 0 1.5z'
    />
    <path
      fill={color}
      d='M11.75 13c.69 0 1.25-.56 1.25-1.25v-2a.75.75 0 0 1 1.5 0v2a2.75 2.75 0 0 1-2.75 2.75h-2a.75.75 0 0 1 0-1.5z'
    />
    <path
      fill={color}
      d='M4.25 13c-.69 0-1.25-.56-1.25-1.25v-2a.75.75 0 0 0-1.5 0v2a2.75 2.75 0 0 0 2.75 2.75h2a.75.75 0 0 0 0-1.5z'
    />
  </svg>
);

export const IconSessionIcon: FC<SVGProps> = ({ color = 'currentcolor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
    width='100%'
    height='100%'
  >
    <path
      fill={color}
      d='M2.75 1.5A1.25 1.25 0 0 0 1.5 2.75v10.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25V2.75c0-.69-.56-1.25-1.25-1.25z'
      opacity='.15'
    />
    <path
      fill={color}
      d='m8 4.25.9 1.82 2.01.29-1.45 1.41.34 2-1.8-.95-1.8.95.34-2-1.45-1.41 2.01-.29z'
    />
  </svg>
);
