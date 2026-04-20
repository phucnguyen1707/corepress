import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import Typo from '@/components/commons/Typo';
import { SelectIcon } from '@/icons';
import { PageNode } from '@/interfaces';

import './editLayout.css';

const parsePx = (raw: unknown): number | null => {
  if (raw == null) return null;
  const m = String(raw).match(/^-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
};

const parseBoxShorthand = (raw: unknown): { top: number; right: number; bottom: number; left: number } | null => {
  if (raw == null) return null;
  const parts = String(raw)
    .trim()
    .split(/\s+/)
    .map(p => parsePx(p))
    .filter((n): n is number => n != null);
  if (parts.length === 0) return null;
  const [t, r = t, b = t, l = r] = parts;
  return { top: t, right: r, bottom: b, left: l };
};

const parseBorderShorthand = (raw: unknown): { width: number; style: string; color: string } | null => {
  if (raw == null || String(raw) === 'none') return null;
  const parts = String(raw).trim().split(/\s+/);
  const width = parsePx(parts[0]) ?? 0;
  const style = parts[1] ?? 'solid';
  const color = parts.slice(2).join(' ') || '#000000';
  return { width, style, color };
};

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

type BoxSides = { top: number; right: number; bottom: number; left: number };

const sidesConfig = [
  { key: 'top', label: 'Top' },
  { key: 'right', label: 'Right' },
  { key: 'bottom', label: 'Bottom' },
  { key: 'left', label: 'Left' },
] as const;

const buildSides = (p: BoxSides) => `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`;

const displayOptions = ['block', 'flex', 'inline-block', 'inline', 'grid', 'none'];
const flexDirectionOptions = ['row', 'row-reverse', 'column', 'column-reverse'];
const justifyOptions = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'];
const alignOptions = ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'];
const borderStyleOptions = ['none', 'solid', 'dashed', 'dotted', 'double'];
const textAlignOptions = ['left', 'center', 'right', 'justify'] as const;

const shadowPresets: Record<string, string> = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.06)',
  md: '0 4px 8px rgba(0,0,0,0.08)',
  lg: '0 8px 16px rgba(0,0,0,0.12)',
  xl: '0 16px 32px rgba(0,0,0,0.16)',
};

export default function EditLayout(props: EditLayoutProps) {
  const {
    selectedNode,
    nodeData,
    backgroundColor,
    setBackgroundColor,
    onUpdateNodeStyle,
    padding,
    setPadding,
  } = props;

  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [display, setDisplay] = useState('block');
  const [flexDirection, setFlexDirection] = useState('row');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('stretch');

  const [margin, setMargin] = useState<BoxSides>({ top: 0, right: 0, bottom: 0, left: 0 });

  const [borderWidth, setBorderWidth] = useState(0);
  const [borderStyle, setBorderStyle] = useState('solid');
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderRadius, setBorderRadius] = useState(0);

  const [textAlign, setTextAlign] = useState<(typeof textAlignOptions)[number]>('left');
  const [shadowPreset, setShadowPreset] = useState('none');
  const [opacity, setOpacity] = useState(100);

  useEffect(() => {
    const s = (nodeData?.style || {}) as Record<string, unknown>;

    setWidth(parsePx(s.width)?.toString() ?? '');
    setHeight(parsePx(s.height)?.toString() ?? '');
    setDisplay((s.display as string) || 'block');
    setFlexDirection((s.flexDirection as string) || 'row');
    setJustifyContent((s.justifyContent as string) || 'flex-start');
    setAlignItems((s.alignItems as string) || 'stretch');

    const m = parseBoxShorthand(s.margin);
    setMargin(m ?? { top: 0, right: 0, bottom: 0, left: 0 });

    const p = parseBoxShorthand(s.padding);
    if (p) setPadding(p);

    if (s.backgroundColor) setBackgroundColor(String(s.backgroundColor));

    const b = parseBorderShorthand(s.border);
    setBorderWidth(b?.width ?? 0);
    setBorderStyle(b?.style ?? 'solid');
    setBorderColor(b?.color ?? '#000000');
    setBorderRadius(parsePx(s.borderRadius) ?? 0);

    const ta = (s.textAlign as string) || 'left';
    setTextAlign((textAlignOptions as readonly string[]).includes(ta) ? (ta as typeof textAlignOptions[number]) : 'left');

    const shadowEntry = Object.entries(shadowPresets).find(([, v]) => v === s.boxShadow);
    setShadowPreset(shadowEntry ? shadowEntry[0] : 'none');

    const op = s.opacity;
    setOpacity(op != null ? Math.round(Number(op) * 100) : 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode]);

  const pushStyle = (key: string, value: string) => {
    if (selectedNode) onUpdateNodeStyle(selectedNode, key, value);
  };

  const applyBorder = (w: number, s: string, c: string) => {
    pushStyle('border', s === 'none' || w === 0 ? 'none' : `${w}px ${s} ${c}`);
  };

  return (
    <div>
      {/* LAYOUT */}
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
                pushStyle('backgroundColor', e.target.value);
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

        <div className='text__edit_layout'>
          <div className='text__edit_layout-title'>
            <Typo type='Typo small bold'>Width (px)</Typo>
          </div>
          <input
            type='text'
            className='text__edit_input'
            placeholder='auto'
            value={width}
            onChange={e => {
              setWidth(e.target.value);
              pushStyle('width', e.target.value ? `${e.target.value}px` : '');
            }}
          />
        </div>

        <div className='text__edit_layout'>
          <div className='text__edit_layout-title'>
            <Typo type='Typo small bold'>Height (px)</Typo>
          </div>
          <input
            type='text'
            className='text__edit_input'
            placeholder='auto'
            value={height}
            onChange={e => {
              setHeight(e.target.value);
              pushStyle('height', e.target.value ? `${e.target.value}px` : '');
            }}
          />
        </div>

        <div className='text__edit_layout'>
          <div className='text__edit_layout-title'>
            <Typo type='Typo small bold'>Display</Typo>
          </div>
          <div className='select__wrapper'>
            <select
              className='select__layout'
              value={display}
              onChange={e => {
                setDisplay(e.target.value);
                pushStyle('display', e.target.value);
              }}
            >
              {displayOptions.map(o => (
                <option
                  key={o}
                  value={o}
                >
                  {o}
                </option>
              ))}
            </select>
            <div className='select__icon'>
              <SelectIcon />
            </div>
          </div>
        </div>

        {display === 'flex' && (
          <>
            <div className='text__edit_layout'>
              <div className='text__edit_layout-title'>
                <Typo type='Typo small bold'>Direction</Typo>
              </div>
              <div className='select__wrapper'>
                <select
                  className='select__layout'
                  value={flexDirection}
                  onChange={e => {
                    setFlexDirection(e.target.value);
                    pushStyle('flexDirection', e.target.value);
                  }}
                >
                  {flexDirectionOptions.map(o => (
                    <option
                      key={o}
                      value={o}
                    >
                      {o}
                    </option>
                  ))}
                </select>
                <div className='select__icon'>
                  <SelectIcon />
                </div>
              </div>
            </div>

            <div className='text__edit_layout'>
              <div className='text__edit_layout-title'>
                <Typo type='Typo small bold'>Justify</Typo>
              </div>
              <div className='select__wrapper'>
                <select
                  className='select__layout'
                  value={justifyContent}
                  onChange={e => {
                    setJustifyContent(e.target.value);
                    pushStyle('justifyContent', e.target.value);
                  }}
                >
                  {justifyOptions.map(o => (
                    <option
                      key={o}
                      value={o}
                    >
                      {o}
                    </option>
                  ))}
                </select>
                <div className='select__icon'>
                  <SelectIcon />
                </div>
              </div>
            </div>

            <div className='text__edit_layout'>
              <div className='text__edit_layout-title'>
                <Typo type='Typo small bold'>Align</Typo>
              </div>
              <div className='select__wrapper'>
                <select
                  className='select__layout'
                  value={alignItems}
                  onChange={e => {
                    setAlignItems(e.target.value);
                    pushStyle('alignItems', e.target.value);
                  }}
                >
                  {alignOptions.map(o => (
                    <option
                      key={o}
                      value={o}
                    >
                      {o}
                    </option>
                  ))}
                </select>
                <div className='select__icon'>
                  <SelectIcon />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* PADDING */}
      <div className='edit__text-session'>
        <Typo type='Typo bold'>Padding Edit</Typo>

        {sidesConfig.map(item => (
          <div
            className='padding__edit_layout'
            key={item.key}
          >
            <div>
              <Typo type='Typo small bold'>{item.label}</Typo>
            </div>
            <div>
              <input
                type='range'
                min={0}
                max={200}
                value={padding[item.key]}
                onChange={e => {
                  const value = Number(e.target.value);
                  const newPadding = { ...padding, [item.key]: value };
                  setPadding(newPadding);
                  pushStyle('padding', buildSides(newPadding));
                }}
                className='padding__slider'
              />
            </div>
            <div className='padding__input_wrapper'>
              <div className='padding__input'>{`${padding[item.key]} px`}</div>
            </div>
          </div>
        ))}
      </div>

      {/* MARGIN */}
      <div className='edit__text-session'>
        <Typo type='Typo bold'>Margin Edit</Typo>

        {sidesConfig.map(item => (
          <div
            className='padding__edit_layout'
            key={`margin-${item.key}`}
          >
            <div>
              <Typo type='Typo small bold'>{item.label}</Typo>
            </div>
            <div>
              <input
                type='range'
                min={0}
                max={200}
                value={margin[item.key]}
                onChange={e => {
                  const value = Number(e.target.value);
                  const newMargin = { ...margin, [item.key]: value };
                  setMargin(newMargin);
                  pushStyle('margin', buildSides(newMargin));
                }}
                className='padding__slider'
              />
            </div>
            <div className='padding__input_wrapper'>
              <div className='padding__input'>{`${margin[item.key]} px`}</div>
            </div>
          </div>
        ))}
      </div>

      {/* BORDER */}
      <div className='edit__text-session'>
        <Typo type='Typo bold'>Border Edit</Typo>

        <div className='padding__edit_layout'>
          <div>
            <Typo type='Typo small bold'>Width</Typo>
          </div>
          <div>
            <input
              type='range'
              min={0}
              max={20}
              value={borderWidth}
              onChange={e => {
                const v = Number(e.target.value);
                setBorderWidth(v);
                applyBorder(v, borderStyle, borderColor);
              }}
              className='padding__slider'
            />
          </div>
          <div className='padding__input_wrapper'>
            <div className='padding__input'>{`${borderWidth} px`}</div>
          </div>
        </div>

        <div className='text__edit_layout'>
          <div className='text__edit_layout-title'>
            <Typo type='Typo small bold'>Style</Typo>
          </div>
          <div className='select__wrapper'>
            <select
              className='select__layout'
              value={borderStyle}
              onChange={e => {
                setBorderStyle(e.target.value);
                applyBorder(borderWidth, e.target.value, borderColor);
              }}
            >
              {borderStyleOptions.map(o => (
                <option
                  key={o}
                  value={o}
                >
                  {o}
                </option>
              ))}
            </select>
            <div className='select__icon'>
              <SelectIcon />
            </div>
          </div>
        </div>

        <div className='text__edit_layout'>
          <div className='text__edit_layout-title'>
            <Typo type='Typo small bold'>Color</Typo>
          </div>
          <div className='color-picker__wrapper'>
            <input
              type='color'
              className='color-picker__input'
              value={borderColor}
              onChange={e => {
                setBorderColor(e.target.value);
                applyBorder(borderWidth, borderStyle, e.target.value);
              }}
            />
            <div
              className='color-picker__preview'
              style={{ backgroundColor: borderColor }}
            >
              <span className='color-picker__text'>{borderColor}</span>
            </div>
          </div>
        </div>

        <div className='padding__edit_layout'>
          <div>
            <Typo type='Typo small bold'>Radius</Typo>
          </div>
          <div>
            <input
              type='range'
              min={0}
              max={100}
              value={borderRadius}
              onChange={e => {
                const v = Number(e.target.value);
                setBorderRadius(v);
                pushStyle('borderRadius', `${v}px`);
              }}
              className='padding__slider'
            />
          </div>
          <div className='padding__input_wrapper'>
            <div className='padding__input'>{`${borderRadius} px`}</div>
          </div>
        </div>
      </div>

      {/* EFFECTS */}
      <div className='edit__text-session'>
        <Typo type='Typo bold'>Effects Edit</Typo>

        <div className='text__edit_layout'>
          <div className='text__edit_layout-title'>
            <Typo type='Typo small bold'>Text Align</Typo>
          </div>
          <div className='align__group'>
            {textAlignOptions.map(o => (
              <button
                key={o}
                type='button'
                className={`align__button ${textAlign === o ? 'align__button--active' : ''}`}
                onClick={() => {
                  setTextAlign(o);
                  pushStyle('textAlign', o);
                }}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <div className='text__edit_layout'>
          <div className='text__edit_layout-title'>
            <Typo type='Typo small bold'>Shadow</Typo>
          </div>
          <div className='select__wrapper'>
            <select
              className='select__layout'
              value={shadowPreset}
              onChange={e => {
                setShadowPreset(e.target.value);
                pushStyle('boxShadow', shadowPresets[e.target.value]);
              }}
            >
              {Object.keys(shadowPresets).map(o => (
                <option
                  key={o}
                  value={o}
                >
                  {o}
                </option>
              ))}
            </select>
            <div className='select__icon'>
              <SelectIcon />
            </div>
          </div>
        </div>

        <div className='padding__edit_layout'>
          <div>
            <Typo type='Typo small bold'>Opacity</Typo>
          </div>
          <div>
            <input
              type='range'
              min={0}
              max={100}
              value={opacity}
              onChange={e => {
                const v = Number(e.target.value);
                setOpacity(v);
                pushStyle('opacity', String(v / 100));
              }}
              className='padding__slider'
            />
          </div>
          <div className='padding__input_wrapper'>
            <div className='padding__input'>{`${opacity} %`}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
