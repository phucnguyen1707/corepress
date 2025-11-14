import React from 'react';

import './typo.css';

export type TypoType =
  | 'Typo small'
  | 'Typo small bold'
  | 'Typo'
  | 'Typo light'
  | 'Typo bold'
  | 'Typo medium'
  | 'Typo medium light'
  | 'Typo medium bold'
  | 'Typo large'
  | 'Typo large light'
  | 'Typo large bold';

interface TypoProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: TypoType;
  children: React.ReactNode;
  color?: string;
  textWrap?: boolean;
  ellipsisRows?: number;
}
const Typo = React.forwardRef<HTMLDivElement, TypoProps>(function Typo(props, _ref) {
  const { type = 'Typo', children, color, textWrap, className, ellipsisRows, ...rest } = props;
  const _className = [`${type.toLowerCase().replaceAll(' ', '-')} core-typo`];
  if (textWrap) {
    _className.push('wrap');
  }
  if (className) _className.push(className);

  return (
    <div
      ref={_ref}
      className={_className.join(' ')}
      style={{
        ...(color && { color }),
        ...(ellipsisRows && {
          WebkitLineClamp: ellipsisRows,
        }),
      }}
      {...rest}
    >
      {children}
    </div>
  );
});

export default Typo;
