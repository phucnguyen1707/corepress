'use client';

import React, { useState } from 'react';

import Typo from '@/components/commons/Typo';
import { DesktopIcon } from '@/icons/D';
import { HomeIcon } from '@/icons/H';
import { MobileIcon } from '@/icons/M';
import { ReturnIcon } from '@/icons/R';
import { SessionIcon, SettingIcon } from '@/icons/S';
import { EDevices, ESideBarActive } from '@/interfaces/common';
import { useTranslations } from 'next-intl';

import './editPage.scss';

interface NodeAttributes {
  id?: string;
  class?: string;
  value?: string;
}

interface PageNode {
  tag: string;
  attribute: NodeAttributes;
  children: string[];
}

interface Page {
  rootNode: string;
  nodes: Record<string, PageNode>;
}

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
        children: ['header-02', 'body-03'],
      },

      // header section
      'header-02': {
        tag: 'header',
        attribute: { id: 'site-header', class: 'header' },
        children: ['div-02', 'div-03'],
      },
      'div-02': {
        tag: 'div',
        attribute: { id: 'logo', class: 'header__logo' },
        children: ['h1-04'],
      },
      'h1-04': {
        tag: 'h1',
        attribute: { id: '', class: 'site-title' },
        children: ['logo-01', 'text-01'],
      },
      'logo-01': {
        tag: 'img',
        attribute: {
          value: 'logo data',
        },
        children: [],
      },
      'text-01': {
        tag: 'text',
        attribute: { value: 'MyWebsite' },
        children: [],
      },

      'div-03': {
        tag: 'div',
        attribute: { id: 'menu', class: 'header__menu' },
        children: ['ul-05'],
      },
      'ul-05': {
        tag: 'ul',
        attribute: { id: '', class: 'menu-list' },
        children: ['li-06', 'li-07', 'li-08'],
      },
      'li-06': {
        tag: 'li',
        attribute: { class: 'menu-item' },
        children: ['text-02'],
      },
      'li-07': {
        tag: 'li',
        attribute: { class: 'menu-item' },
        children: ['text-03'],
      },
      'li-08': {
        tag: 'li',
        attribute: { class: 'menu-item' },
        children: ['text-04'],
      },
      'text-02': {
        tag: 'text',
        attribute: { value: 'Home' },
        children: [],
      },
      'text-03': {
        tag: 'text',
        attribute: { value: 'About' },
        children: [],
      },
      'text-04': {
        tag: 'text',
        attribute: { value: 'Contact' },
        children: [],
      },

      // body section
      'body-03': {
        tag: 'body',
        attribute: { id: 'main', class: 'page-body' },
        children: ['h2-09', 'p-10'],
      },
      'h2-09': {
        tag: 'h2',
        attribute: { class: 'welcome-title' },
        children: ['text-05'],
      },
      'text-05': {
        tag: 'text',
        attribute: { value: 'Welcome to My Website!' },
        children: [],
      },
      'p-10': {
        tag: 'p',
        attribute: { class: 'intro' },
        children: ['text-06'],
      },
      'text-06': {
        tag: 'text',
        attribute: { value: 'We are glad to have you here.' },
        children: [],
      },
    },
  };

  const renderNode = (nodeId: string): React.ReactNode => {
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
          alt={'Logo'}
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

  const renderTree = (rootId: string) => {
    const node = mockupData.nodes[rootId];

    return (
      <div className='tree-node'>
        <div className='tree-item'>
          <div className='tag-name'>
            {node.tag}
            {node.attribute.value && ` ${node.attribute.value}`}
          </div>
        </div>

        <div className='tree-children'>{node.children.map(childId => renderTree(childId))}</div>
      </div>
    );
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
          <div className='section-content'>{renderTree(mockupData.rootNode)}</div>
        </div>
        <div className='second-section'>{renderNode(mockupData.rootNode)}</div>
      </div>
    </div>
  );
}
