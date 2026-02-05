import React, { useEffect, useState } from 'react';

import { editNode } from '@/axios/page.service';
import Typo from '@/components/commons/Typo';
import { PageNode } from '@/interfaces';

import './editText.css';

type EditTextProps = {
  nodeText: string;
  pageId: number;
  selectedNode: string;
  nodeData: PageNode;
};

export default function EditText(props: EditTextProps) {
  const { nodeText, pageId, selectedNode, nodeData } = props;
  const [textValue, setTextValue] = useState(nodeText || '');

  console.log(nodeData);
  const handleUpdateText = async () => {
    try {
      const res = await editNode(pageId, selectedNode, nodeData);
      console.log(res);
    } catch (err) {
      console.error('Failed edit node:', err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (textValue !== nodeText) {
        handleUpdateText();
      }
    }, 1000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeText, textValue]);

  return (
    <div>
      <div className='edit__text-session'>
        <Typo type='Typo bold'>Text Edit</Typo>

        <textarea
          className='setting__text-area'
          value={textValue}
          rows={2}
          onChange={e => setTextValue(e.target.value)}
        />
      </div>
      {/* <div className='edit__text-session'>
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
            </div> */}
    </div>
  );
}
