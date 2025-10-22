import React, { FC } from 'react';

import { SVGProps } from '@/interfaces/common';

export const TemplateSessionIcon: FC<SVGProps> = ({ color = 'currentcolor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
    width='100%'
    height='100%'
  >
    <path
      fill={color}
      d='M1.5 3.25c0-.966.784-1.75 1.75-1.75h1a.75.75 0 0 1 0 1.5h-1a.25.25 0 0 0-.25.25v1a.75.75 0 0 1-1.5 0z'
    />
    <path
      fill={color}
      fillRule='evenodd'
      d='M1.5 7.25c0-.966.784-1.75 1.75-1.75h9.5c.966 0 1.75.784 1.75 1.75v1.5a1.75 1.75 0 0 1-1.75 1.75h-9.5a1.75 1.75 0 0 1-1.75-1.75zm1.75-.25a.25.25 0 0 0-.25.25v1.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25v-1.5a.25.25 0 0 0-.25-.25z'
    />
    <path
      fill={color}
      d='M1.5 12.75c0 .966.784 1.75 1.75 1.75h1a.75.75 0 0 0 0-1.5h-1a.25.25 0 0 1-.25-.25v-1a.75.75 0 0 0-1.5 0z'
    />
    <path
      fill={color}
      d='M12.75 1.5c.966 0 1.75.784 1.75 1.75v1a.75.75 0 0 1-1.5 0v-1a.25.25 0 0 0-.25-.25h-1a.75.75 0 0 1 0-1.5z'
    />
    <path
      fill={color}
      d='M12.75 14.5a1.75 1.75 0 0 0 1.75-1.75v-1a.75.75 0 0 0-1.5 0v1a.25.25 0 0 1-.25.25h-1a.75.75 0 0 0 0 1.5z'
    />
    <path
      fill={color}
      d='M9.75 2.25a.75.75 0 0 1-.75.75h-2a.75.75 0 0 1 0-1.5h2a.75.75 0 0 1 .75.75'
    />
    <path
      fill={color}
      d='M9 14.5a.75.75 0 0 0 0-1.5h-2a.75.75 0 0 0 0 1.5z'
    />
  </svg>
);

export const TextSessionIcon: FC<SVGProps> = ({ color = 'currentcolor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
    width='100%'
    height='100%'
  >
    <path
      fill={color}
      d='M1.75 2a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z'
    />
    <path
      fill={color}
      d='M2 5.5a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5z'
    />
    <path
      fill={color}
      d='M1 9.75a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5h-12.5a.75.75 0 0 1-.75-.75'
    />
    <path
      fill={color}
      d='M2 12.5a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5z'
    />
  </svg>
);
