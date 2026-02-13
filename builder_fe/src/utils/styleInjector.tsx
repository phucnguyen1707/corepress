import { useEffect, useRef } from 'react';

interface Props {
  rawCss: string;
}

export default function SectionStyleManager({ rawCss }: Props) {
  useEffect(() => {
    const styleId = '__builder_section_styles__';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    if (rawCss) {
      styleEl.appendChild(document.createTextNode(rawCss));
    }
  }, [rawCss]);

  return null;
}
