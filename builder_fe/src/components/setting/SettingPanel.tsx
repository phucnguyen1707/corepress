'use client';

import React from 'react';

import { SettingIcon } from '@/icons';
import { Page } from '@/interfaces';

import Typo from '../commons/Typo';
import './settingPanel.css';

interface SettingPanelProps {
  mockupData: Page;
  selectedNode: string | null;
}

export default function SettingPanel(props: SettingPanelProps) {
  const { mockupData, selectedNode } = props;
  const renderSettingsPanel = () => {
    if (!selectedNode) {
      return (
        <div className='setting-container'>
          <div className='setting-icon'>
            <SettingIcon />
          </div>

          <Typo type='Typo medium'>Select an element to edit</Typo>
        </div>
      );
    }

    const node = mockupData.nodes[selectedNode];
    if (!node) return null;
  };

  return <div className='setting-section'>{renderSettingsPanel()}</div>;
}
