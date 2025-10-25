'use client';

import React, { JSX, ReactNode, useState } from 'react';

import Typo from '@/components/commons/Typo';
import SettingPanel from '@/components/setting';
import {
  ArrowRightIcon,
  DesktopIcon,
  FooterSessionIcon,
  HeaderSectionIcon,
  HomeIcon,
  ImageSessionIcon,
  LinkSessionIcon,
  MobileIcon,
  ReturnIcon,
  SessionIcon,
  SettingIcon,
  TemplateSessionIcon,
  TextSessionIcon,
} from '@/icons';
import { EDevices, ESideBarActive, Page } from '@/interfaces';
import '@/nodeCss/footer.css';
import '@/nodeCss/header.css';
import '@/nodeCss/template.css';

import './editPage.css';

const iconsList: Record<string, JSX.Element> = {
  header: <HeaderSectionIcon />,
  template: <TemplateSessionIcon />,
  footer: <FooterSessionIcon />,
  image: <ImageSessionIcon />,
  text: <TextSessionIcon />,
  menu: <LinkSessionIcon />,
};

export default function LoginPage() {
  const [device, setDevice] = useState<EDevices>(EDevices.desktop);
  const [activeAction, setActiveAction] = useState<ESideBarActive>(ESideBarActive.session);

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const mockupData: Page = {
    rootNode: 'html-01',
    nodes: {
      'html-01': {
        tag: 'html',
        attribute: { id: '', class: '' },
        children: ['header-02', 'template-09', 'footer-18'],
        devAttribute: { dataId: 'html-01' },
      },

      // header section
      'header-02': {
        tag: 'div',
        attribute: { class: 'header' },
        children: ['div-03', 'div-05'],
        devAttribute: { dataId: 'header-02' },
        builderRender: {
          groupName: 'header',
          renderName: 'Header',
          renderIconName: 'header',
        },
      },
      'div-03': {
        tag: 'div',
        attribute: { class: 'header__content' },
        children: ['div-04'],
        devAttribute: { dataId: 'div-03' },
      },
      'div-04': {
        tag: 'text',
        attribute: { value: 'MyWebsite', class: 'header__title' },
        children: [],
        devAttribute: { dataId: 'div-04' },
        builderRender: {
          renderName: 'Header Title',
          renderIconName: 'text',
        },
      },
      'div-05': {
        tag: 'div',
        attribute: { class: 'header__menu' },
        children: ['div-06'],
        devAttribute: { dataId: 'div-05' },
      },
      'div-06': {
        tag: 'div',
        attribute: { class: 'menu-item' },
        children: ['a-07'],
        devAttribute: { dataId: 'div-06' },
        builderRender: {
          renderName: 'Header Menu',
          renderIconName: 'menu',
        },
      },
      'a-07': {
        tag: 'a',
        attribute: { class: 'menu-link' },
        children: ['text-08'],
        devAttribute: { dataId: 'a-07' },
      },
      'text-08': {
        tag: 'text',
        attribute: { value: 'Home' },
        children: [],
        devAttribute: { dataId: 'text-08' },
        builderRender: {
          renderName: 'Header Menu Text',
          renderIconName: 'text',
        },
      },

      // template section
      'template-09': {
        tag: 'div',
        attribute: { class: 'template' },
        children: ['div-10'],
        devAttribute: { dataId: 'template-09' },
        builderRender: {
          groupName: 'template',
          renderName: 'Template',
          renderIconName: 'template',
        },
      },
      'div-10': {
        tag: 'div',
        attribute: { class: 'hero__content' },
        children: ['div-11', 'div-13'],
        devAttribute: { dataId: 'div-10' },
      },
      'div-11': {
        tag: 'div',
        attribute: { class: 'hero__image__container' },
        children: ['img-12'],
        devAttribute: { dataId: 'div-11' },
      },
      'img-12': {
        tag: 'img',
        attribute: {
          class: 'hero__image',
          value: 'https://i.ibb.co/XrDHM9qq/pexels-thiago-kai-1873845-32394258.jpg',
        },
        children: [],
        devAttribute: { dataId: 'img-12' },
        builderRender: {
          renderName: 'Hero Image',
          renderIconName: 'image',
        },
      },
      'div-13': {
        tag: 'div',
        attribute: { class: 'hero__text__container' },
        children: ['h2-14', 'div-16'],
        devAttribute: { dataId: 'div-13' },
      },
      'h2-14': {
        tag: 'h2',
        attribute: { class: 'hero__title' },
        children: ['text-15'],
        devAttribute: { dataId: 'h2-14' },
      },
      'text-15': {
        tag: 'text',
        attribute: { value: 'Welcome to My Website!' },
        children: [],
        devAttribute: { dataId: 'text-15' },
        builderRender: {
          renderName: 'Hero Title',
          renderIconName: 'text',
        },
      },
      'div-16': {
        tag: 'div',
        attribute: { class: 'hero__subtitle' },
        children: ['text-17'],
        devAttribute: { dataId: 'div-16' },
      },
      'text-17': {
        tag: 'text',
        attribute: { value: 'We are glad to have you here.' },
        children: [],
        devAttribute: { dataId: 'text-17' },
        builderRender: {
          renderName: 'Hero Subtitle',
          renderIconName: 'text',
        },
      },

      // footer section
      'footer-18': {
        tag: 'div',
        attribute: { class: 'footer' },
        children: ['div-19', 'div-21'],
        devAttribute: { dataId: 'footer-18' },
        builderRender: {
          groupName: 'footer',
          renderName: 'Footer',
          renderIconName: 'footer',
        },
      },
      'div-19': {
        tag: 'div',
        attribute: { class: 'footer__top' },
        children: ['text-20'],
        devAttribute: { dataId: 'div-19' },
      },
      'text-20': {
        tag: 'text',
        attribute: { value: 'Contact Us' },
        children: [],
        devAttribute: { dataId: 'text-20' },
        builderRender: {
          renderName: 'Footer Title Text',
          renderIconName: 'text',
        },
      },
      'div-21': {
        tag: 'div',
        attribute: { class: 'footer__bottom' },
        children: ['text-22'],
        devAttribute: { dataId: 'div-21' },
      },
      'text-22': {
        tag: 'text',
        attribute: { value: '© 2025 MyWebsite. All rights reserved.' },
        children: [],
        devAttribute: { dataId: 'text-22' },
        builderRender: {
          renderName: 'Footer Copyright',
          renderIconName: 'text',
        },
      },
    },
  };

  const renderNode = (nodeId: string): ReactNode => {
    const node = mockupData.nodes[nodeId];
    if (!node) return null;

    const { tag, attribute, children } = node;
    const isHovered = hoveredNodeId === node.devAttribute?.dataId;

    if (tag === 'text') {
      return (
        <div
          key={nodeId}
          className={`${attribute.class || ''} ${isHovered ? 'hovered-node' : ''}`}
          data-id={node.devAttribute?.dataId}
        >
          {attribute.value || 'empty value'}
        </div>
      );
    }

    if (tag === 'img') {
      return (
        <img
          key={nodeId}
          src={attribute.value}
          alt={node.builderRender?.renderName}
          className={`${attribute.class || ''} ${isHovered ? 'hovered-node' : ''}`}
        />
      );
    }

    const childElements = children?.map((childId: string) => renderNode(childId));

    return React.createElement(
      tag,
      {
        key: nodeId,
        id: attribute.id || undefined,
        'data-id': node.devAttribute?.dataId,
        className: `${attribute.class || ''} ${isHovered ? 'hovered-node' : ''}`,
      },
      childElements?.length ? childElements : null
    );
  };

  const renderTree = (rootId: string): ReactNode => {
    const node = mockupData.nodes[rootId];
    if (!node) return null;

    const isExpanded = expandedNodes.has(rootId);
    const hasChildren = node.children.length > 0;

    const children = hasChildren ? node.children.map(childId => renderTree(childId)) : [];

    // Case 1: Node has a name → render it + visible children container
    if (node.builderRender?.renderName) {
      return (
        <div
          key={rootId}
          className='tree-container'
        >
          <div
            className='tree-item'
            onMouseEnter={() => setHoveredNodeId(node.devAttribute?.dataId || null)}
            onMouseLeave={() => setHoveredNodeId(null)}
            onClick={() => setSelectedNode(rootId)}
          >
            {hasChildren && (
              <div
                className='icon-size'
                onClick={() => toggleExpand(rootId)}
                style={{
                  cursor: 'pointer',
                  transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                  transition: 'transform 0.2s',
                }}
              >
                <ArrowRightIcon color='grey' />
              </div>
            )}

            <div className='icon-size'>{iconsList[node.builderRender.renderIconName || 'text']}</div>

            <Typo className='tag-name'>{node.builderRender.renderName}</Typo>
          </div>

          {isExpanded && hasChildren && <div className='tree-children'>{children}</div>}
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
      if (node.builderRender?.groupName === 'header') sections.Header.push(id);
      else if (node.builderRender?.groupName === 'template') sections.Template.push(id);
      else if (node.builderRender?.groupName === 'footer') sections.Footer.push(id);
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

        <SettingPanel
          selectedNode={selectedNode}
          mockupData={mockupData}
        />
      </div>
    </div>
  );
}
