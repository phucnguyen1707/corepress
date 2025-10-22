import React, { FC } from 'react';

import { SVGProps } from '@/interfaces/common';

export const FooterSessionIcon: FC<SVGProps> = ({ color = 'currentcolor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
    width='100%'
    height='100%'
  >
    <path
      fill={color}
      d='M1.5 3.25c0-.966.784-1.75 1.75-1.75h.5a.75.75 0 0 1 0 1.5h-.5a.25.25 0 0 0-.25.25v.5a.75.75 0 0 1-1.5 0z'
    />
    <path
      fill={color}
      fillRule='evenodd'
      d='M1.5 11.25c0-.966.784-1.75 1.75-1.75h9.5c.966 0 1.75.784 1.75 1.75v1.5a1.75 1.75 0 0 1-1.75 1.75h-9.5a1.75 1.75 0 0 1-1.75-1.75zm1.75-.25a.25.25 0 0 0-.25.25v1.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25v-1.5a.25.25 0 0 0-.25-.25z'
    />
    <path
      fill={color}
      d='M1.5 6.75c0 .966.784 1.75 1.75 1.75h.5a.75.75 0 0 0 0-1.5h-.5a.25.25 0 0 1-.25-.25v-.5a.75.75 0 0 0-1.5 0z'
    />
    <path
      fill={color}
      d='M12.75 1.5c.966 0 1.75.784 1.75 1.75v.5a.75.75 0 0 1-1.5 0v-.5a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5z'
    />
    <path
      fill={color}
      d='M12.75 8.5a1.75 1.75 0 0 0 1.75-1.75v-.5a.75.75 0 0 0-1.5 0v.5a.25.25 0 0 1-.25.25h-.5a.75.75 0 0 0 0 1.5z'
    />
    <path
      fill={color}
      d='M9.75 2.25a.75.75 0 0 1-.75.75h-2a.75.75 0 0 1 0-1.5h2a.75.75 0 0 1 .75.75'
    />
    <path
      fill={color}
      d='M9 8.5a.75.75 0 0 0 0-1.5h-2a.75.75 0 0 0 0 1.5z'
    />
  </svg>
);
