'use client';

import React, { JSX, ReactNode, useState } from 'react';

import Typo from '@/components/commons/Typo';
import {
  ArrowRightIcon,
  DesktopIcon,
  FooterSessionIcon,
  HeaderSectionIcon,
  HomeIcon,
  MobileIcon,
  ReturnIcon,
  SessionIcon,
  SettingIcon,
  TemplateSessionIcon,
  TextSessionIcon,
} from '@/icons';
import { LinkSessionIcon, LogoSessionIcon } from '@/icons/L';
import { EDevices, ESideBarActive } from '@/interfaces/common';
import '@/nodeCss/header.css';
import '@/nodeCss/template.css';
import { useTranslations } from 'next-intl';

import './editPage.css';

interface NodeAttributes {
  id?: string;
  class?: string;
  value?: string;
}

interface PageNode {
  tag: string;
  attribute: NodeAttributes;
  children: string[];
  name?: string;
}

interface Page {
  rootNode: string;
  nodes: Record<string, PageNode>;
}

const iconsList: Record<string, JSX.Element> = {
  header: <HeaderSectionIcon />,
  body: <TemplateSessionIcon />,
  footer: <FooterSessionIcon />,
  logo: <LogoSessionIcon />,
  text: <TextSessionIcon />,
  menu: <LinkSessionIcon />,
};

export default function LoginPage() {
  const t = useTranslations('Login');

  const [device, setDevice] = useState<EDevices>(EDevices.desktop);
  const [activeAction, setActiveAction] = useState<ESideBarActive>(ESideBarActive.session);

  const mockupData: Page = {
    rootNode: 'html-01',
    nodes: {
      'html-01': {
        tag: 'html',
        attribute: { id: '', class: '' },
        children: ['header-02', 'template-03'],
      },

      // header section
      'header-02': {
        tag: 'header',
        attribute: { id: 'site-header', class: 'header' },
        children: ['div-02', 'div-03'],
        name: 'header',
      },
      'div-02': {
        tag: 'div',
        attribute: { id: 'logo', class: 'header__content' },
        children: ['h1-04'],
      },

      'h1-04': {
        tag: 'h1',
        attribute: { id: '', class: 'header__title' },
        children: ['text-01'],
      },

      'text-01': {
        tag: 'text',
        attribute: { value: 'MyWebsite' },
        children: [],
        name: 'text',
      },

      'div-03': {
        tag: 'div',
        attribute: { id: 'menu', class: 'header__menu' },
        children: ['ul-05'],
      },
      'ul-05': {
        tag: 'ul',
        attribute: { id: '', class: 'menu-list' },
        children: ['li-06'],
        name: 'menu',
      },
      'li-06': {
        tag: 'li',
        attribute: { id: '', class: 'menu-item' },
        children: ['a-07'],
      },
      'a-07': {
        tag: 'a',
        attribute: { id: '', class: 'menu-link' },
        children: ['text-02'],
      },
      'text-02': {
        tag: 'text',
        attribute: { value: 'Home' },
        children: [],
        name: 'text',
      },

      // template section
      'template-03': {
        tag: 'div',
        attribute: { id: 'main', class: 'template' },
        children: ['div-04'],
        name: 'template',
      },
      'div-04': {
        tag: 'div',
        attribute: { class: 'hero__content' },
        children: ['div-05', 'div-06'],
      },
      'div-05': {
        tag: 'div',
        attribute: { class: 'hero__image__container' },
        children: ['img-06'],
      },
      'img-06': {
        tag: 'img',
        attribute: {
          class: 'hero__image',
          value: 'https://i.ibb.co/XrDHM9qq/pexels-thiago-kai-1873845-32394258.jpg',
        },
        children: [],
        name: 'hero__image',
      },
      'div-06': {
        tag: 'div',
        attribute: { class: 'hero__text__container' },
        children: ['h2-09', 'p-10'],
      },
      'h2-09': {
        tag: 'h2',
        attribute: { class: 'hero__title' },
        children: ['text-05'],
      },
      'text-05': {
        tag: 'text',
        attribute: { value: 'Welcome to My Website!' },
        children: [],
        name: 'hero__title-text',
      },
      'p-10': {
        tag: 'p',
        attribute: { class: 'hero__subtitle' },
        children: ['text-06'],
      },
      'text-06': {
        tag: 'text',
        attribute: { value: 'We are glad to have you here.' },
        children: [],
        name: 'hero__subtitle-text',
      },
    },
  };

  const renderNode = (nodeId: string): ReactNode => {
    const node = mockupData.nodes[nodeId];
    if (!node) return null;

    const { tag, attribute, children } = node;

    if (tag === 'text') {
      return attribute.value || 'empty value';
    }

    if (tag === 'img') {
      return (
        <img
          src={attribute.value}
          alt={node.name}
          className={attribute.class}
        />
      );
    }

    const childElements = children?.map((childId: string) => renderNode(childId));

    return React.createElement(
      tag,
      {
        key: nodeId,
        id: attribute.id || undefined,
        className: attribute.class || undefined,
      },
      childElements && childElements.length > 0 ? childElements : null
    );
  };

  const renderTree = (rootId: string): ReactNode => {
    const node = mockupData.nodes[rootId];
    if (!node) return null;

    const children = node.children.map(childId => renderTree(childId));

    // Case 1: Node has a name → render it + visible children container
    if (node.name) {
      return (
        <div
          key={rootId}
          className='tree-container'
        >
          <div className='tree-item'>
            {node.children.length > 0 && (
              <div className='icon-size'>
                <ArrowRightIcon color='grey' />
              </div>
            )}

            <div className='icon-size'>{iconsList[node.name]}</div>

            <Typo className='tag-name'>{node.name}</Typo>
          </div>

          {children.length > 0 && <div className='tree-children'>{children}</div>}
        </div>
      );
    }

    // Case 2: Node has no name → just render its children directly
    return <div key={rootId}>{children}</div>;
  };

  const renderGroupedSections = () => {
    const sections = {
      Header: [] as string[],
      Template: [] as string[],
      Footer: [] as string[],
    };

    // Categorize based on tag or naming pattern
    Object.entries(mockupData.nodes).forEach(([id, node]) => {
      if (node.tag === 'header') sections.Header.push(id);
      else if (node.tag === 'body') sections.Template.push(id);
      else if (node.tag === 'footer') sections.Footer.push(id);
    });

    return Object.entries(sections).map(([sectionName, ids]) => (
      <div
        key={sectionName}
        className='section-wrapper'
      >
        <Typo type='Typo bold'>{sectionName}</Typo>

        {ids.map(id => renderTree(id))}
      </div>
    ));
  };

  return (
    <div className='edit-page'>
      <div className='header-session'>
        <div className='every-session'>
          <div className='icon-size'>
            <ReturnIcon />
          </div>
          <Typo>Website Name</Typo>
        </div>

        <div className='every-session'>
          <div className='icon-size'>
            <HomeIcon />
          </div>
          <Typo>Website Session</Typo>
        </div>

        <div className='every-session'>
          <div className='device-choose'>
            <div className={`device-background ${device === EDevices.desktop ? 'active' : ''}`}>
              <div
                className='device-icon'
                onClick={() => setDevice(EDevices.desktop)}
              >
                <DesktopIcon />
              </div>
            </div>

            <div className={`device-background ${device === EDevices.mobile ? 'active' : ''}`}>
              <div
                className='device-icon'
                onClick={() => setDevice(EDevices.mobile)}
              >
                <MobileIcon />
              </div>
            </div>
          </div>

          <div className='save-button'>Save</div>
        </div>
      </div>
      <div className='body-session'>
        <div className='first-section'>
          <div className='action-bar'>
            <div
              className={`action-item ${activeAction === ESideBarActive.session ? 'active' : ''}`}
              onClick={() => setActiveAction(ESideBarActive.session)}
            >
              <SessionIcon />
            </div>
            <div
              className={`action-item ${activeAction === ESideBarActive.setting ? 'active' : ''}`}
              onClick={() => setActiveAction(ESideBarActive.setting)}
            >
              <SettingIcon />
            </div>
          </div>
          <div className='section-content'>
            <div className='page-name'>
              <Typo type='Typo medium bold'>Website Page</Typo>
            </div>

            {renderGroupedSections()}
          </div>
        </div>
        <div className='second-section'>{renderNode(mockupData.rootNode)}</div>

        <div className='first-section'></div>
      </div>
    </div>
  );
}
