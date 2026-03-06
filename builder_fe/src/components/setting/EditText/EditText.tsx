import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { editNode } from '@/axios/page.service';
import Typo from '@/components/commons/Typo';
import { SelectIcon } from '@/icons';
import { PageNode } from '@/interfaces';

import './editText.css';

type EditTextProps = {
  pageId: number;
  selectedNode: string;
  nodeData: PageNode;
  onRefreshData: () => Promise<void>;
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  onUpdateNodeStyle: (nodeId: string, key: string, value: string) => void;
};

export default function EditText(props: EditTextProps) {
  const { pageId, selectedNode, nodeData, onRefreshData, color, setColor, onUpdateNodeStyle } = props;

  return (
    <div>
      <div className='edit__text-session'>
        <Typo type='Typo bold'>Typo Edit</Typo>

        <div className='text__edit_layout'>
          <div className='text__edit_layout-title'>
            <Typo type='Typo small bold'>Font Weight</Typo>
          </div>

          <div className='select__wrapper'>
            <select className='select__layout'>
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
              <SelectIcon />
            </div>
          </div>
        </div>

        <div className='text__edit_layout'>
          <div className='text__edit_layout-title'>
            <Typo type='Typo small bold'>Font Size</Typo>
          </div>

          <div className='select__wrapper'>
            <select className='select__layout'>
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
              <SelectIcon />
            </div>
          </div>
        </div>

        <div className='text__edit_layout'>
          <div className='text__edit_layout-title'>
            <Typo type='Typo small bold'>Font Color</Typo>
          </div>

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
  );
}
