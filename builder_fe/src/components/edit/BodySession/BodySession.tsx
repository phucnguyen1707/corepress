'use client';

import React, { JSX, ReactNode, useEffect, useState } from 'react';

import { cssPage, page } from '@/axios/page.service';
import Typo from '@/components/commons/Typo';
import AddSectionModal from '@/components/modal';
import SettingPanel from '@/components/setting';
import {
  AddIcon,
  ArrowRightIcon,
  FooterSessionIcon,
  HeaderSectionIcon,
  IconSessionIcon,
  ImageSessionIcon,
  LinkSessionIcon,
  SessionIcon,
  SettingIcon,
  TemplateSessionIcon,
  TextSessionIcon,
} from '@/icons';
import { ContainerSessionIcon } from '@/icons/C';
import { PromoSessionIcon } from '@/icons/P';
import { CssData, ESideBarActive, Page } from '@/interfaces';
import { UserInfoPage } from '@/interfaces/auth.interface';
import SectionStyleInjector from '@/utils/styleInjector';

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
  icon: <IconSessionIcon />,
  container: <ContainerSessionIcon />,
  promo: <PromoSessionIcon />,
};

export default function BodySession(props: BodySessionProps) {
  const { pageInfo } = props;

  const [pageData, setPageData] = useState<Page>({
    bodyNode: '',
    htmlNode: '',
    nodes: {},
  });

  const [cssData, setCssData] = useState<CssData>({
    json: {},
    raw: '',
  });

  const [activeAction, setActiveAction] = useState<ESideBarActive>(ESideBarActive.session);
  const [modalSectionType, setModalSectionType] = useState<string>('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const fetchPageData = async () => {
    if (!pageInfo) return;

    try {
      const res = await page(pageInfo?.[0].id);
      setPageData(res.data.data);
    } catch (err) {
      console.error('Failed to load page:', err);
    }
  };

  const fetchCssDataPage = async () => {
    if (!pageInfo) return;

    try {
      const res = await cssPage(pageInfo?.[0].id);
      setCssData(res.data);
    } catch (err) {
      console.error('Failed to load css data:', err);
    }
  };

  useEffect(() => {
    fetchPageData();
    fetchCssDataPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (node.attribute?.devGroupName === 'header') sections.Header.push(id);
      else if (node.attribute?.devGroupName === 'template') sections.Template.push(id);
      else if (node.attribute?.devGroupName === 'footer') sections.Footer.push(id);
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

    const childrenNoSvgTag = node.children.filter(childId => {
      const child = pageData.nodes[childId];
      return child && child.tag !== 'svg';
    });

    const hasChildren = node.children.length > 0;

    const children = hasChildren ? childrenNoSvgTag.map(childId => renderTree(childId)) : [];

    // Case 1: Node has a name → render it + visible children container
    if (node.attribute.devName) {
      return (
        <div
          key={rootId}
          className='tree-container'
          id={rootId}
        >
          <div
            className='tree-item'
            id={node.attribute?.dataId}
            onMouseEnter={() => setHoveredNodeId(node.attribute?.dataId || null)}
            onMouseLeave={() => setHoveredNodeId(null)}
            onClick={() => setSelectedNode(rootId)}
          >
            {hasChildren && childrenNoSvgTag.length > 0 && (
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

            <div className='icon-size'>{iconsList[node.attribute?.devIcon || 'text']}</div>

            <Typo className='tag-name'>{node.attribute.devName}</Typo>
          </div>

          {isExpanded && hasChildren && <div className='tree-children'>{children}</div>}
        </div>
      );
    }

    // Case 2: Node has no name → just render its children directly
    return <div key={rootId + '-children'}>{children}</div>;
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
    const isHovered = hoveredNodeId === node.attribute.dataId;

    if (text) {
      return (
        <>
          <div
            key={nodeId}
            className={[attribute.class, isHovered ? 'hovered-node' : ''].filter(Boolean).join(' ')}
            style={node.style || undefined}
            data-id={node.attribute.dataId}
          >
            {text || 'empty value'}
          </div>
          {children?.map(childId => renderNode(childId))}
        </>
      );
    }

    if (tag === 'svg') {
      return (
        <svg
          key={nodeId}
          data-id={node.attribute.dataId}
          className={`${attribute.class || undefined} ${isHovered ? 'hovered-node' : ''}`}
          style={node.style || undefined}
          viewBox={attribute.viewBox || '0 0 100% 100%'}
          fill={attribute.fill || 'none'}
          stroke={attribute.stroke || 'none'}
          strokeWidth={attribute['stroke-width'] || 2}
        >
          {children?.map(childId => renderNode(childId))}
        </svg>
      );
    }

    if (tag === 'circle') {
      return (
        <circle
          key={nodeId}
          data-id={node.attribute.dataId}
          className={`${attribute.class || undefined} ${isHovered ? 'hovered-node' : ''}`}
          style={node.style || undefined}
          cx={attribute.cx || ''}
          cy={attribute.cy || ''}
          r={attribute.r || ''}
        />
      );
    }

    if (tag === 'path') {
      return (
        <path
          key={nodeId}
          data-id={node.attribute.dataId}
          className={`${attribute.class || undefined} ${isHovered ? 'hovered-node' : ''}`}
          style={node.style || undefined}
          d={attribute.d || ''}
        />
      );
    }

    if (tag === 'img') {
      return (
        // eslint-disable-next-line
        <img
          key={nodeId}
          src={attribute.value}
          alt={node.attribute.devName || 'image'}
          className={`${attribute.class || undefined} ${isHovered ? 'hovered-node' : ''}`}
          style={node.style || undefined}
        />
      );
    }

    const childElements = children?.map((childId: string) => renderNode(childId));

    return React.createElement(
      tag,
      {
        key: nodeId,
        id: attribute.id || undefined,
        'data-id': node.attribute.dataId,
        className: `${attribute.class || undefined} ${isHovered ? 'hovered-node' : ''}`,
        style: node.style || undefined,
      },
      childElements?.length ? childElements : null
    );
  };

  const updateNodeStyle = (nodeId: string, key: string, value: string) => {
    setPageData(prev => {
      const updatedNodes = {
        ...prev.nodes,
        [nodeId]: {
          ...prev.nodes[nodeId],
          style: {
            ...prev.nodes[nodeId].style,
            [key]: value,
          },
        },
      };

      return {
        ...prev,
        nodes: updatedNodes,
      };
    });
  };

  return (
    <div className='body-session'>
      <SectionStyleInjector rawCss={cssData.raw} />
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
        pageId={pageInfo?.[0].id}
        selectedNode={selectedNode}
        pageData={pageData}
        onRefreshData={fetchPageData}
        onUpdateNodeStyle={updateNodeStyle}
      />

      <AddSectionModal
        pageId={pageInfo?.[0].id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sectionType={modalSectionType}
        onRefreshData={fetchPageData}
      />
    </div>
  );
}
