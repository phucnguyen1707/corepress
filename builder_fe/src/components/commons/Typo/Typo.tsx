import React from 'react';

import './typo.scss';

export type TypoType =
  | 'Page title'
  | 'Breadcrumbs'
  | 'Body'
  | 'Body Bold'
  | 'Body Bold 2'
  | 'Body Link'
  | 'Body Light'
  | 'Body Card'
  | 'Card Label'
  | 'Icon Label'
  | 'Field Label'
  | 'Field Label Bold'
  | 'View Property'
  | 'Features'
  | 'Card Agency Name'
  | 'Pricing';

interface TypoProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: TypoType;
  children: React.ReactNode;
  color?: string;
  textWrap?: boolean;
  ellipsisRows?: number;
}
const Typo = React.forwardRef<HTMLDivElement, TypoProps>(function Typo(props, _ref) {
  const { type = 'Body', children, color, textWrap, className, ellipsisRows, ...rest } = props;
  const _className = [`${type.toLowerCase().replaceAll(' ', '-')} rso-typo`];
  textWrap && _className.push('wrap');
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
