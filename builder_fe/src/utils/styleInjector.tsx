import { useEffect, useRef } from 'react';

import { sectionCssMap } from './cssData';

interface Props {
  activeDataIds: string[];
}

export default function SectionStyleManager({ activeDataIds }: Props) {
  const injectedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const styleId = '__builder_section_styles__';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    let cssToAppend = '';

    activeDataIds.forEach(id => {
      if (injectedIdsRef.current.has(id)) return;

      console.log('activeDataIds:', activeDataIds);
      console.log('sectionCssMap keys:', Object.keys(sectionCssMap));
      const css = sectionCssMap[id];
      if (!css) return;

      injectedIdsRef.current.add(id);
      cssToAppend += `\n/* ${id} */\n${css}\n`;
    });

    if (cssToAppend) {
      styleEl.appendChild(document.createTextNode(cssToAppend));
    }
  }, [activeDataIds]);

  return null;
}
