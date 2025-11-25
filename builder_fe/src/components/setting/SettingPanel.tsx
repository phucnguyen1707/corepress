'use client';

import React from 'react';

import { EditIcon, SelectIcon, SettingIcon } from '@/icons';
import { Page } from '@/interfaces';

import Typo from '../commons/Typo';
import './settingPanel.css';

interface SettingPanelProps {
  mockupData: Page;
  selectedNode: string | null;
}

export default function SettingPanel({ mockupData, selectedNode }: SettingPanelProps) {
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
          <Typo type='Typo medium bold'>{node.dev.builderRender?.renderName}</Typo>
        </div>

        {node.tag === 'img' && (
          <div className='setting__image-settings'>
            <div className='setting__image-preview-title'>
              <Typo type='Typo small'>Preview</Typo>
            </div>

            <div className='setting__image-preview'>
              <img
                className='image-preview'
                src={node.attribute.value}
                alt='Preview'
              />

              <div className='setting__image-url-overlay'>
                <div className='overlay__icon'>
                  <EditIcon />
                </div>
                <Typo type='Typo small'>Change</Typo>
              </div>

              <div className='setting__image-url-container'>
                <Typo
                  className='setting__image-url'
                  type='Typo small'
                >
                  {node.attribute.value}
                </Typo>
              </div>
            </div>
          </div>
        )}

        {node.tag === 'text' && (
          <div>
            <div className='edit__text-session'>
              <Typo type='Typo bold'>Text Edit</Typo>

              <textarea
                className='setting__text-area'
                value={node.attribute.value || ''}
                rows={2}
              />
            </div>
            <div className='edit__text-session'>
              <Typo type='Typo bold'>Layout Edit</Typo>

              <div className='text__edit_layout'>
                <div className='text__edit_layout-title'>
                  <Typo type='Typo small bold'>Width</Typo>
                </div>

                <div className='switch__container'>
                  <div className='switch__button'>Fit</div>
                  <div className='switch__button-active'>Fill</div>
                </div>
              </div>
            </div>

            <div className='edit__text-session'>
              <Typo type='Typo bold'>Typo Edit</Typo>

              <div className='text__edit_layout'>
                <div className='text__edit_layout-title'>
                  <Typo type='Typo small bold'>Font Weight</Typo>
                </div>

                <select>
                  <option value='normal'>Normal</option>
                  <option value='bold'>Bold</option>
                  <option value='light'>Light</option>
                  <option value='600'>Semi-Bold</option>
                </select>
              </div>

              <div className='text__edit_layout'>
                <div className='text__edit_layout-title'>
                  <Typo type='Typo small bold'>Font Size</Typo>
                </div>

                <div className='select__wrapper'>
                  <select className='select__layout'>
                    <option
                      className='option__layout'
                      value='typo small'
                    >
                      Small
                    </option>
                    <option
                      className='option__layout'
                      value='typo'
                    >
                      Normal
                    </option>
                    <option
                      className='option__layout'
                      value='typo medium'
                    >
                      Medium
                    </option>
                    <option
                      className='option__layout'
                      value='typo large'
                    >
                      Large
                    </option>
                  </select>

                  <div className='select__icon'>
                    <SelectIcon />
                  </div>
                </div>
              </div>

              <div className='text__edit_layout'>
                <div className='text__edit_layout-title'>
                  <Typo type='Typo small bold'>Font Color</Typo>
                </div>

                <select>
                  <option value='red'>Red</option>
                  <option value='blue'>Blue</option>
                  <option value='black'>Black</option>
                  <option value='yellow'>Yellow</option>
                </select>
              </div>

              <div className='text__edit_layout'>
                <div className='text__edit_layout-title'>
                  <Typo type='Typo small bold'>Case</Typo>
                </div>

                <div className='switch__container'>
                  <div className='switch__button'>Default</div>
                  <div className='switch__button-active'>Uppercase</div>
                </div>
              </div>
            </div>

            <div className='edit__text-session'>
              <Typo type='Typo bold'>Appearance Edit</Typo>

              <div className='text__edit_layout'>
                <div className='text__edit_layout-title'>
                  <Typo type='Typo small bold'>Background</Typo>
                  CheckBox here
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return <div className='setting-section'>{renderSettingsPanel()}</div>;
}
