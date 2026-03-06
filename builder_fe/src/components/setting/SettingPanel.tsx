'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { editNode } from '@/axios/page.service';
import { SettingIcon } from '@/icons';
import { Page } from '@/interfaces';

import Typo from '../commons/Typo';
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

  useEffect(() => {
    if (node?.text) {
      setTextValue(node.text);
    } else {
      setTextValue('');
    }
  }, [node]);

  const handleUpdateText = useCallback(async () => {
    if (!node || !selectedNode) return;

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
  }, [node, selectedNode, pageId, textValue, onRefreshData]);

  useEffect(() => {
    if (!node) return;

    const timeout = setTimeout(() => {
      handleUpdateText();
    }, 800);

    return () => clearTimeout(timeout);
  }, [textValue, handleUpdateText, node]);

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
              onChange={e => setTextValue(e.target.value)}
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
