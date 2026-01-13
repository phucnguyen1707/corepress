'use client';

import React, { JSX, ReactNode, useEffect, useState } from 'react';

import { page } from '@/axios/page.service';
import Typo from '@/components/commons/Typo';
import AddSectionModal from '@/components/modal';
import SettingPanel from '@/components/setting';
import {
  AddIcon,
  ArrowRightIcon,
  FooterSessionIcon,
  HeaderSectionIcon,
  ImageSessionIcon,
  LinkSessionIcon,
  SessionIcon,
  SettingIcon,
  TemplateSessionIcon,
  TextSessionIcon,
} from '@/icons';
import { ESideBarActive, Page } from '@/interfaces';
import { UserInfoPage } from '@/interfaces/auth.interface';

import './bodySession.css';

interface BodySessionProps {
  pageInfo: UserInfoPage[] | undefined;
}

const iconsList: Record<string, JSX.Element> = {
  header: <HeaderSectionIcon />,
  template: <TemplateSessionIcon />,
  footer: <FooterSessionIcon />,
  image: <ImageSessionIcon />,
  text: <TextSessionIcon />,
  menu: <LinkSessionIcon />,
};

export default function BodySession(props: BodySessionProps) {
  const { pageInfo } = props;

  const [pageData, setPageData] = useState<Page>({
    bodyNode: '',
    htmlNode: '',
    nodes: {},
  });
  const [activeAction, setActiveAction] = useState<ESideBarActive>(ESideBarActive.session);
  const [modalSectionType, setModalSectionType] = useState<string>('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!pageInfo) return;
    const fetchPageData = async () => {
      try {
        const res = await page(pageInfo?.[0].id);

        setPageData(res.data.data);
      } catch (err) {
        console.error('Failed to load user info:', err);
      }
    };
    fetchPageData();
  }, [pageInfo]);

  const renderGroupedSections = () => {
    const sections = {
      Header: [] as string[],
      Template: [] as string[],
      Footer: [] as string[],
    };

    if (!pageData) return;

    // Categorize based on tag or naming pattern
    Object.entries(pageData.nodes).forEach(([id, node]) => {
      if (node.tag === 'html' || node.tag === 'body') return;
      if (node.dev?.builderRender?.groupName === 'header') sections.Header.push(id);
      else if (node.dev?.builderRender?.groupName === 'template') sections.Template.push(id);
      else if (node.dev?.builderRender?.groupName === 'footer') sections.Footer.push(id);
    });

    return Object.entries(sections).map(([sectionName, ids]) => (
      <div
        key={sectionName}
        className='section-wrapper'
      >
        <Typo type='Typo bold'>{sectionName}</Typo>
        {ids.map(id => renderTree(id))}

        <div
          className='add__section-button'
          onClick={() => {
            setModalSectionType(sectionName);
            setIsModalOpen(true);
          }}
        >
          <div className='add__section-icon'>
            <AddIcon color='#3b82f6' />
          </div>
          <Typo
            className='add_section-text'
            type='Typo small'
          >
            Add Section
          </Typo>
        </div>
      </div>
    ));
  };

  const renderTree = (rootId: string): ReactNode => {
    const node = pageData.nodes[rootId];
    if (!node) return null;

    const isExpanded = expandedNodes.has(rootId);
    const hasChildren = node.children.length > 0;

    const children = hasChildren ? node.children.map(childId => renderTree(childId)) : [];

    // Case 1: Node has a name → render it + visible children container
    if (node.dev?.builderRender?.renderName) {
      return (
        <div
          key={rootId}
          className='tree-container'
          id={rootId}
        >
          <div
            className='tree-item'
            id={node.dev.attribute?.dataId}
            onMouseEnter={() => setHoveredNodeId(node.dev.attribute?.dataId || null)}
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

            <div className='icon-size'>{iconsList[node.dev.builderRender.renderIconName || 'text']}</div>

            <Typo className='tag-name'>{node.dev.builderRender.renderName}</Typo>
          </div>

          {isExpanded && hasChildren && <div className='tree-children'>{children}</div>}
        </div>
      );
    }

    // Case 2: Node has no name → just render its children directly
    return <div key={rootId}>{children}</div>;
  };

  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const renderNode = (nodeId: string): ReactNode => {
    const node = pageData.nodes[nodeId];

    if (!node) return null;

    const { tag, attribute, children, text } = node;
    const isHovered = hoveredNodeId === node.dev?.attribute?.dataId;

    if (text) {
      return (
        <div
          key={nodeId}
          className={`${attribute.class || ''} ${isHovered ? 'hovered-node' : ''}`}
          data-id={node.dev.attribute?.dataId}
        >
          {text || 'empty value'}
        </div>
      );
    }

    // if (tag === 'img') {
    //   return (
    //     // eslint-disable-next-line
    //     <img
    //       key={nodeId}
    //       src={attribute.value}
    //       alt={node.dev.builderRender?.renderName}
    //       className={`${attribute.class || ''} ${isHovered ? 'hovered-node' : ''}`}
    //     />
    //   );
    // }

    const childElements = children?.map((childId: string) => renderNode(childId));

    return React.createElement(
      tag,
      {
        key: nodeId,
        id: attribute.id || undefined,
        'data-id': node.dev?.attribute?.dataId,
        className: `${attribute.class || ''} ${isHovered ? 'hovered-node' : ''}`,
      },
      childElements?.length ? childElements : null
    );
  };

  return (
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
      <div className='second-section'>{renderNode(pageData.bodyNode)}</div>

      <SettingPanel
        selectedNode={selectedNode}
        mockupData={pageData}
      />

      <AddSectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sectionType={modalSectionType}
      />
    </div>
  );
}
