import { allSections } from './mockupData';

export const sectionCssMap: Record<string, string> = {};

Object.values(allSections)
  .flat()
  .forEach(section => {
    sectionCssMap[section.id] = section.css.trim().replaceAll('\n', '');
  });
