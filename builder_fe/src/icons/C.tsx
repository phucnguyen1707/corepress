import React, { FC } from 'react';

import { SVGProps } from '@/interfaces/common';

export const ContainerSessionIcon: FC<SVGProps> = ({ color = 'currentcolor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
    width='100%'
    height='100%'
  >
    <path
      fill={color}
      fillRule='evenodd'
      d='M1.5 3.25c0-.966.784-1.75 1.75-1.75h9.5c.966 0 1.75.784 1.75 1.75v9.5a1.75 1.75 0 0 1-1.75 1.75h-9.5A1.75 1.75 0 0 1 1.5 12.75zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25z'
    />
    <path
      fill={color}
      d='M4 6.5h8v1.5H4z'
    />
    <path
      fill={color}
      d='M4 9.5h5v1.5H4z'
    />
  </svg>
);
