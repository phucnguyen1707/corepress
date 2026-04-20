'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { editNode } from '@/axios/page.service';
import { SettingIcon } from '@/icons';
import { Page } from '@/interfaces';

import Typo from '../commons/Typo';
import EditIcon from './EditIcon/EditIcon';
import EditImage from './EditImage/EditImage';
import EditLayout from './EditLayout/EditLayout';
import EditText from './EditText/EditText';
import './settingPanel.css';

interface SettingPanelProps {
  pageData: Page;
  selectedNode: string | null;
  pageId: number | undefined;
  onRefreshData: () => Promise<void>;
  onUpdateNodeStyle: (nodeId: string, key: string, value: string) => void;
}

export default function SettingPanel({
  pageData,
  selectedNode,
  pageId = 0,
  onRefreshData,
  onUpdateNodeStyle,
}: SettingPanelProps) {
  const node = useMemo(() => {
    if (!selectedNode) return null;
    return pageData.nodes?.[selectedNode] || null;
  }, [pageData.nodes, selectedNode]);

  const findDescendantByTag = (rootId: string | null, tag: string): string | null => {
    if (!rootId) return null;
    const n = pageData.nodes?.[rootId];
    if (!n) return null;
    if (n.tag === tag) return rootId;
    for (const childId of n.children || []) {
      const found = findDescendantByTag(childId, tag);
      if (found) return found;
    }
    return null;
  };

  const svgNodeId = useMemo(
    () => findDescendantByTag(selectedNode, 'svg'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedNode, pageData.nodes]
  );

  const imgNodeId = useMemo(
    () => findDescendantByTag(selectedNode, 'img'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedNode, pageData.nodes]
  );

  const [fontSize, setFontSize] = useState('16px');
  const [fontWeight, setFontWeight] = useState('normal');
  const [padding, setPadding] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const [textValue, setTextValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (node?.text) {
      setTextValue(node.text);
      setIsTyping(false);
    } else {
      setTextValue('');
      setIsTyping(false);
    }
  }, [node?.text]);

  const handleUpdateText = useCallback(async () => {
    if (!node || !selectedNode) return;
    if (textValue === node.text) return;

    try {
      const res = await editNode(pageId, selectedNode, {
        node: {
          ...node,
          text: textValue,
        },
      });

      if (res.status === 200) {
        await onRefreshData();
      }
    } catch (err) {
      console.error('Failed edit node:', err);
    }
  }, [textValue, node, selectedNode, pageId, onRefreshData]);

  useEffect(() => {
    if (!node || !isTyping) return;

    const timeout = setTimeout(() => {
      handleUpdateText();
      setIsTyping(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [textValue, isTyping]);

  if (!selectedNode || !node) {
    return (
      <div className='setting-section'>
        <div className='setting__container-empty'>
          <div className='setting-icon'>
            <SettingIcon />
          </div>
          <Typo type='Typo medium'>Select an element to edit</Typo>
        </div>
      </div>
    );
  }

  return (
    <div className='setting-section'>
      <div className='setting__container-layout'>
        <div className='setting__container-name'>
          <Typo type='Typo medium bold'>{node.attribute?.devName}</Typo>
        </div>

        {node.text && (
          <div className='edit__text-session'>
            <Typo type='Typo bold'>Text Edit</Typo>
            <textarea
              className='setting__text-area'
              value={textValue}
              rows={2}
              onChange={e => {
                setTextValue(e.target.value);
                setIsTyping(true);
              }}
            />
          </div>
        )}

        <EditLayout
          nodeData={node}
          selectedNode={selectedNode}
          pageId={pageId}
          onRefreshData={onRefreshData}
          backgroundColor={backgroundColor}
          padding={padding}
          setPadding={setPadding}
          setBackgroundColor={setBackgroundColor}
          onUpdateNodeStyle={onUpdateNodeStyle}
        />

        {imgNodeId && pageData.nodes[imgNodeId] && (
          <EditImage
            nodeData={pageData.nodes[imgNodeId]}
            selectedNode={imgNodeId}
            pageId={pageId}
            onRefreshData={onRefreshData}
          />
        )}

        {svgNodeId && (
          <EditIcon
            selectedNode={svgNodeId}
            pageId={pageId}
            onRefreshData={onRefreshData}
          />
        )}

        {node.text && (
          <EditText
            nodeData={node}
            selectedNode={selectedNode}
            pageId={pageId}
            onRefreshData={onRefreshData}
            color={color}
            setColor={setColor}
            onUpdateNodeStyle={onUpdateNodeStyle}
          />
        )}
      </div>
    </div>
  );
}

// {node.tag === 'img' && (
//   <div className='setting__image-settings'>
//     <div className='setting__image-preview-title'>
//       <Typo type='Typo small'>Preview</Typo>
//     </div>

//     <div className='setting__image-preview'>
//       <img
//         className='image-preview'
//         src={node.attribute.value}
//         alt='Preview'
//       />

//       <div className='setting__image-url-overlay'>
//         <div className='overlay__icon'>
//           <EditIcon />
//         </div>
//         <Typo type='Typo small'>Change</Typo>
//       </div>

//       <div className='setting__image-url-container'>
//         <Typo
//           className='setting__image-url'
//           type='Typo small'
//         >
//           {node.attribute.value}
//         </Typo>
//       </div>
//     </div>
//   </div>
// )}
