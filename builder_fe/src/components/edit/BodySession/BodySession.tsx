'use client';

import React, { JSX, ReactNode, useEffect, useRef, useState } from 'react';

import { cssPage, deleteNode as deleteNodeApi, editNode, page } from '@/axios/page.service';
import Typo from '@/components/commons/Typo';
import AddSectionModal from '@/components/modal';
import PreviewSkeleton from '@/components/edit/BodySession/PreviewSkeleton';
import SettingPanel from '@/components/setting';
import {
  AddIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  FooterSessionIcon,
  HeaderSectionIcon,
  IconSessionIcon,
  ImageSessionIcon,
  LinkSessionIcon,
  SessionIcon,
  SettingIcon,
  TemplateSessionIcon,
  TextSessionIcon,
  TrashIcon,
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

  const [cssLoaded, setCssLoaded] = useState(false);
  const [activeAction, setActiveAction] = useState<ESideBarActive>(ESideBarActive.session);
  const [modalSectionType, setModalSectionType] = useState<string>('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const persistTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const latestNodeRef = useRef<Record<string, Page['nodes'][string]>>({});

  const fetchPageData = async (signal: { cancelled: boolean }) => {
    if (!pageInfo) return;

    try {
      const res = await page(pageInfo?.[0].id);
      if (signal.cancelled) return;
      setPageData(res.data.data);
    } catch (err) {
      if (!signal.cancelled) console.error('Failed to load page:', err);
    }
  };

  const fetchCssDataPage = async (signal: { cancelled: boolean }) => {
    if (!pageInfo) return;

    try {
      const res = await cssPage(pageInfo?.[0].id);
      if (signal.cancelled) return;
      setCssData(res.data);
    } catch (err) {
      if (!signal.cancelled) console.error('Failed to load css data:', err);
    } finally {
      if (!signal.cancelled) setCssLoaded(true);
    }
  };

  useEffect(() => {
    const signal = { cancelled: false };
    setCssLoaded(false);
    fetchPageData(signal);
    fetchCssDataPage(signal);
    return () => {
      signal.cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageInfo]);

  const refreshPageData = async () => {
    await fetchPageData({ cancelled: false });
  };

  useEffect(() => {
    const timers = persistTimers.current;
    return () => {
      Object.values(timers).forEach(t => clearTimeout(t));
    };
  }, []);

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
      const isHidden = (node.style as React.CSSProperties | undefined)?.display === 'none';

      return (
        <div
          key={rootId}
          className='tree-container'
          id={rootId}
        >
          <div
            className={`tree-item ${isHidden ? 'tree-item--hidden' : ''}`}
            id={node.attribute?.dataId}
            onMouseEnter={() => setHoveredNodeId(node.attribute?.dataId || null)}
            onMouseLeave={() => setHoveredNodeId(null)}
            onClick={() => setSelectedNode(rootId)}
          >
            {hasChildren && childrenNoSvgTag.length > 0 && (
              <div
                className='icon-size'
                onClick={e => {
                  e.stopPropagation();
                  toggleExpand(rootId);
                }}
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

            <div className='tree-item__actions'>
              <button
                type='button'
                className='tree-item__action-btn'
                title={isHidden ? 'Show' : 'Hide'}
                onClick={e => {
                  e.stopPropagation();
                  handleToggleHidden(rootId);
                }}
              >
                {isHidden ? <EyeOffIcon color='#6b7280' /> : <EyeIcon color='#6b7280' />}
              </button>
              <button
                type='button'
                className='tree-item__action-btn tree-item__action-btn--danger'
                title='Delete'
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteNode(rootId);
                }}
              >
                <TrashIcon color='#ef4444' />
              </button>
            </div>
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

  const handleDeleteNode = async (nodeId: string) => {
    const id = pageInfo?.[0].id;
    if (!id) return;
    if (!confirm('Delete this section? This cannot be undone.')) return;

    try {
      await deleteNodeApi(id, nodeId);
      if (selectedNode === nodeId) setSelectedNode(null);
      await refreshPageData();
    } catch (err) {
      console.error('Failed to delete node:', err);
    }
  };

  const handleToggleHidden = async (nodeId: string) => {
    const id = pageInfo?.[0].id;
    if (!id) return;

    const targetNode = pageData.nodes[nodeId];
    if (!targetNode) return;

    const isHidden = (targetNode.style as React.CSSProperties | undefined)?.display === 'none';
    const nextStyle: React.CSSProperties = { ...(targetNode.style || {}) };
    if (isHidden) {
      delete (nextStyle as Record<string, unknown>).display;
    } else {
      nextStyle.display = 'none';
    }

    const updatedNode = { ...targetNode, style: nextStyle };

    setPageData(prev => ({
      ...prev,
      nodes: { ...prev.nodes, [nodeId]: updatedNode },
    }));

    try {
      await editNode(id, nodeId, { node: updatedNode });
    } catch (err) {
      console.error('Failed to toggle hidden:', err);
    }
  };

  // Attributes the builder owns. Everything else on a node is a real HTML attribute and has to
  // reach the DOM — an <a> without its href is not a link, and a <button> without aria-label is
  // an unlabelled control.
  const BUILDER_ATTRS = new Set([
    'class',
    'style',
    'dataId',
    'devName',
    'devIcon',
    'devGroupName',
    'css-id',
  ]);
  // Attributes React insists on receiving camelCased. The SVG ones matter because any element other
  // than svg/circle/path (a <g>, say) falls through to the generic branch below, and React drops a
  // hyphenated presentation attribute it does not recognise.
  const REACT_PROP: Record<string, string> = {
    tabindex: 'tabIndex',
    for: 'htmlFor',
    readonly: 'readOnly',
    maxlength: 'maxLength',
    autocomplete: 'autoComplete',
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'stroke-dasharray': 'strokeDasharray',
    'stroke-dashoffset': 'strokeDashoffset',
    'stroke-opacity': 'strokeOpacity',
    'fill-rule': 'fillRule',
    'fill-opacity': 'fillOpacity',
    'clip-rule': 'clipRule',
    'clip-path': 'clipPath',
    'stop-color': 'stopColor',
    'stop-opacity': 'stopOpacity',
  };

  const URL_ATTRS = new Set(['href', 'src', 'action', 'formaction']);
  const isSafeUrl = (value: string) => {
    const url = value.replace(/[\u0000-\u0020]/g, '').toLowerCase();
    if (url.startsWith('#') || url.startsWith('/') || url.startsWith('./')) return true;
    return /^(https?|mailto|tel):/.test(url);
  };

  const domAttributes = (attribute: Record<string, string>) => {
    const out: Record<string, string> = {};
    for (const [name, value] of Object.entries(attribute)) {
      if (BUILDER_ATTRS.has(name)) continue;
      // The backend sanitises on the way in, but pages saved BEFORE it did are still in the
      // database — and this function is what finally hands an attribute to the DOM. An event
      // handler or a javascript: URL must not get through here either.
      if (/^on/i.test(name)) continue;
      if (URL_ATTRS.has(name.toLowerCase()) && value && !isSafeUrl(value)) {
        out[name] = '#';
        continue;
      }
      out[REACT_PROP[name] ?? name] = value;
    }
    return out;
  };

  const cx = (cls: string | undefined, hovered: boolean) =>
    [cls, hovered ? 'hovered-node' : ''].filter(Boolean).join(' ') || undefined;

  const renderNode = (nodeId: string): ReactNode => {
    const node = pageData.nodes[nodeId];

    if (!node) return null;

    const { tag, attribute, children, text } = node;
    const isHovered = hoveredNodeId === node.attribute.dataId;

    // A run of text sitting between inline elements. It is a real node so that its ORDER relative to
    // its siblings survives (see htmlToNodes) — but it renders as a bare string, not an element.
    if (tag === '#text') {
      return text ?? null;
    }

    if (tag === 'svg') {
      return (
        <svg
          key={nodeId}
          data-id={node.attribute.dataId}
          className={cx(attribute.class, isHovered)}
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
          className={cx(attribute.class, isHovered)}
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
          className={cx(attribute.class, isHovered)}
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
          className={cx(attribute.class, isHovered)}
          style={node.style || undefined}
        />
      );
    }

    const childElements = children?.map((childId: string) => renderNode(childId)) ?? [];

    // Text belongs INSIDE the node, and the node keeps its own tag. This used to short-circuit
    // any node that had text into a sibling <div>, which silently turned every <button> and
    // <a href> carrying a label into a plain div: no keyboard focus, no role, no href — and it
    // made every :focus-visible rule in the templates dead, because a div cannot take focus.
    const content: ReactNode[] = text ? [text, ...childElements] : childElements;

    return React.createElement(
      tag,
      {
        ...domAttributes(attribute),
        key: nodeId,
        'data-id': node.attribute.dataId,
        className: cx(attribute.class, isHovered),
        style: node.style || undefined,
      },
      content.length ? content : null
    );
  };

  const updateNodeStyle = (nodeId: string, key: string, value: string) => {
    setPageData(prev => {
      const prevNode = prev.nodes[nodeId];
      if (!prevNode) return prev;

      const updatedNode = {
        ...prevNode,
        style: {
          ...prevNode.style,
          [key]: value,
        },
      };

      latestNodeRef.current[nodeId] = updatedNode;

      return {
        ...prev,
        nodes: { ...prev.nodes, [nodeId]: updatedNode },
      };
    });

    const id = pageInfo?.[0].id;
    if (!id) return;

    if (persistTimers.current[nodeId]) {
      clearTimeout(persistTimers.current[nodeId]);
    }
    persistTimers.current[nodeId] = setTimeout(() => {
      const node = latestNodeRef.current[nodeId];
      if (!node) return;
      editNode(id, nodeId, { node }).catch(err =>
        console.error('Failed to persist node style:', err)
      );
      delete persistTimers.current[nodeId];
    }, 600);
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
      <div className='second-section'>
        {cssLoaded ? renderNode(pageData.bodyNode) : <PreviewSkeleton />}
      </div>

      <SettingPanel
        pageId={pageInfo?.[0].id}
        selectedNode={selectedNode}
        pageData={pageData}
        onRefreshData={refreshPageData}
        onUpdateNodeStyle={updateNodeStyle}
      />

      <AddSectionModal
        pageId={pageInfo?.[0].id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sectionType={modalSectionType}
        onRefreshData={refreshPageData}
      />
    </div>
  );
}
