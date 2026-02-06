'use client';

import React from 'react';

import { SettingIcon } from '@/icons';
import { Page } from '@/interfaces';

import Typo from '../commons/Typo';
import EditText from './EditText/EditText';
import './settingPanel.css';

interface SettingPanelProps {
  mockupData: Page;
  selectedNode: string | null;
  pageId: number | undefined;
  onRefreshData: () => Promise<void>;
}

export default function SettingPanel({ mockupData, selectedNode, pageId = 0, onRefreshData }: SettingPanelProps) {
  const renderSettingsPanel = () => {
    if (!selectedNode) {
      return (
        <div className='setting__container-empty'>
          <div className='setting-icon'>
            <SettingIcon />
          </div>
          <Typo type='Typo medium'>Select an element to edit</Typo>
        </div>
      );
    }

    const node = mockupData.nodes[selectedNode];
    if (!node) return null;

    return (
      <div className='setting__container-layout'>
        <div className='setting__container-name'>
          <Typo type='Typo medium bold'>{node.attribute?.devName}</Typo>
        </div>

        {node.text && (
          <EditText
            nodeData={node}
            selectedNode={selectedNode}
            pageId={pageId}
            onRefreshData={onRefreshData}
          />
        )}
      </div>
    );
  };

  return <div className='setting-section'>{renderSettingsPanel()}</div>;
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
