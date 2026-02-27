'use client';

import React, { useState } from 'react';

import { SettingIcon } from '@/icons';
import { Page } from '@/interfaces';

import Typo from '../commons/Typo';
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
  const [fontSize, setFontSize] = useState('16px');
  const [fontWeight, setFontWeight] = useState('normal');
  const [padding, setPadding] = useState('0px');
  const [margin, setMargin] = useState('0px');
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

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

    const node = pageData.nodes[selectedNode];
    if (!node) return null;

    return (
      <div className='setting__container-layout'>
        <div className='setting__container-name'>
          <Typo type='Typo medium bold'>{node.attribute?.devName}</Typo>
        </div>

        <div className='edit-style__container'>
          <div className='edit-style__section'>
            <Typo type='Typo small bold'>Font Size</Typo>
            <div className='select__wrapper'>
              <select
                className='select__layout'
                value={fontSize}
                onChange={e => {
                  setFontSize(e.target.value);
                  if (selectedNode) {
                    onUpdateNodeStyle(selectedNode, 'fontSize', e.target.value);
                  }
                }}
              >
                <option value='12px'>12px</option>
                <option value='14px'>14px</option>
                <option value='16px'>16px</option>
                <option value='18px'>18px</option>
                <option value='20px'>20px</option>
                <option value='24px'>24px</option>
                <option value='28px'>28px</option>
                <option value='32px'>32px</option>
                <option value='36px'>36px</option>
                <option value='40px'>40px</option>
                <option value='48px'>48px</option>
              </select>
              <div className='select__icon'>
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 14 14'
                  fill='none'
                >
                  <path
                    d='M3.5 5.25L7 8.75L10.5 5.25'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className='edit-style__section'>
            <Typo type='Typo small bold'>Font Weight</Typo>
            <div className='select__wrapper'>
              <select
                className='select__layout'
                value={fontWeight}
                onChange={e => {
                  setFontWeight(e.target.value);
                  if (selectedNode) {
                    onUpdateNodeStyle(selectedNode, 'fontWeight', e.target.value);
                  }
                }}
              >
                <option value='100'>Thin (100)</option>
                <option value='200'>Extra Light (200)</option>
                <option value='300'>Light (300)</option>
                <option value='normal'>Normal (400)</option>
                <option value='500'>Medium (500)</option>
                <option value='600'>Semi Bold (600)</option>
                <option value='bold'>Bold (700)</option>
                <option value='800'>Extra Bold (800)</option>
                <option value='900'>Black (900)</option>
              </select>
              <div className='select__icon'>
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 14 14'
                  fill='none'
                >
                  <path
                    d='M3.5 5.25L7 8.75L10.5 5.25'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className='edit-style__section'>
            <Typo type='Typo small bold'>Padding</Typo>
            <div className='select__wrapper'>
              <select
                className='select__layout'
                value={padding}
                onChange={e => {
                  setPadding(e.target.value);
                  if (selectedNode) {
                    onUpdateNodeStyle(selectedNode, 'padding', e.target.value);
                  }
                }}
              >
                <option value='0px'>0px</option>
                <option value='4px'>4px</option>
                <option value='8px'>8px</option>
                <option value='12px'>12px</option>
                <option value='16px'>16px</option>
                <option value='20px'>20px</option>
                <option value='24px'>24px</option>
                <option value='32px'>32px</option>
                <option value='40px'>40px</option>
                <option value='48px'>48px</option>
              </select>
              <div className='select__icon'>
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 14 14'
                  fill='none'
                >
                  <path
                    d='M3.5 5.25L7 8.75L10.5 5.25'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className='edit-style__section'>
            <Typo type='Typo small bold'>Margin</Typo>
            <div className='select__wrapper'>
              <select
                className='select__layout'
                value={margin}
                onChange={e => {
                  setMargin(e.target.value);
                  if (selectedNode) {
                    onUpdateNodeStyle(selectedNode, 'margin', e.target.value);
                  }
                }}
              >
                <option value='0px'>0px</option>
                <option value='4px'>4px</option>
                <option value='8px'>8px</option>
                <option value='12px'>12px</option>
                <option value='16px'>16px</option>
                <option value='20px'>20px</option>
                <option value='24px'>24px</option>
                <option value='32px'>32px</option>
                <option value='40px'>40px</option>
                <option value='48px'>48px</option>
              </select>
              <div className='select__icon'>
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 14 14'
                  fill='none'
                >
                  <path
                    d='M3.5 5.25L7 8.75L10.5 5.25'
                    stroke='currentColor'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className='edit-style__section'>
            <Typo type='Typo small bold'>Font Color</Typo>
            <div className='color-picker__wrapper'>
              <input
                type='color'
                className='color-picker__input'
                value={color}
                onChange={e => {
                  setColor(e.target.value);
                  if (selectedNode) {
                    onUpdateNodeStyle(selectedNode, 'color', e.target.value);
                  }
                }}
              />
              <div
                className='color-picker__preview'
                style={{ backgroundColor: color }}
              >
                <span className='color-picker__text'>{color}</span>
              </div>
            </div>
          </div>

          <div className='edit-style__section'>
            <Typo type='Typo small bold'>Background Color</Typo>
            <div className='color-picker__wrapper'>
              <input
                type='color'
                className='color-picker__input'
                value={backgroundColor}
                onChange={e => {
                  setBackgroundColor(e.target.value);
                  if (selectedNode) {
                    onUpdateNodeStyle(selectedNode, 'backgroundColor', e.target.value);
                  }
                }}
              />
              <div
                className='color-picker__preview'
                style={{ backgroundColor: backgroundColor }}
              >
                <span className='color-picker__text'>{backgroundColor}</span>
              </div>
            </div>
          </div>
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
