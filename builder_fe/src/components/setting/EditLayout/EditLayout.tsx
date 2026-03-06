import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { editNode } from '@/axios/page.service';
import Typo from '@/components/commons/Typo';
import { SelectIcon } from '@/icons';
import { PageNode } from '@/interfaces';

import './editLayout.css';

type EditLayoutProps = {
  pageId: number;
  selectedNode: string;
  nodeData: PageNode;
  onRefreshData: () => Promise<void>;
  backgroundColor: string;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  setPadding: React.Dispatch<
    React.SetStateAction<{
      top: number;
      right: number;
      bottom: number;
      left: number;
    }>
  >;
  setBackgroundColor: Dispatch<SetStateAction<string>>;
  onUpdateNodeStyle: (nodeId: string, key: string, value: string) => void;
};

export default function EditLayout(props: EditLayoutProps) {
  const {
    pageId,
    selectedNode,
    nodeData,
    onRefreshData,
    backgroundColor,
    setBackgroundColor,
    onUpdateNodeStyle,
    padding,
    setPadding,
  } = props;

  return (
    <div>
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

        <div className='text__edit_layout'>
          <div className='text__edit_layout-title'>
            <Typo type='Typo small bold'>Background Color</Typo>
          </div>

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

      <div className='edit__text-session'>
        <Typo type='Typo bold'>Padding Edit</Typo>

        <div className='padding__edit_layout'>
          <div>
            <Typo type='Typo small bold'>Top</Typo>
          </div>

          <div>
            <input
              type='range'
              min={0}
              max={200}
              value={padding.top}
              onChange={e => setPadding({ ...padding, top: Number(e.target.value) })}
              className='padding__slider'
            />
          </div>

          <div className='padding__input_wrapper'>
            <div
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPadding({ ...padding, top: Number(e.target.value) })
              }
              className='padding__input'
            >{`${padding.top} px`}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
