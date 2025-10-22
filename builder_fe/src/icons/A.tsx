import React, { FC } from 'react';

import { SVGProps } from '@/interfaces/common';

export const ArrowRightIcon: FC<SVGProps> = ({ color = 'currentcolor' }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
    width='100%'
    height='100%'
  >
    <path
      fill={color}
      fillRule='evenodd'
      d='M4.24 6.2a.75.75 0 0 1 1.06.04l2.7 2.908 2.7-2.908a.75.75 0 0 1 1.1 1.02l-3.25 3.5a.75.75 0 0 1-1.1 0l-3.25-3.5a.75.75 0 0 1 .04-1.06'
    ></path>
  </svg>
);
