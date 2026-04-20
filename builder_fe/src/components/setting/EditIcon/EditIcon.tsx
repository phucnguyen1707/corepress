import React, { useState } from 'react';

import { replaceIcon } from '@/axios/page.service';
import Typo from '@/components/commons/Typo';

import './editIcon.css';

type EditIconProps = {
  pageId: number;
  selectedNode: string;
  onRefreshData: () => Promise<void>;
};

export default function EditIcon({ pageId, selectedNode, onRefreshData }: EditIconProps) {
  const [svg, setSvg] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (saving) return;

    const trimmed = svg.trim();
    if (!trimmed.startsWith('<svg')) {
      setError('Paste must start with <svg>');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const res = await replaceIcon(pageId, selectedNode, trimmed);
      if (res.status === 200) {
        await onRefreshData();
        setSvg('');
      } else {
        setError('Replace failed');
      }
    } catch (err: any) {
      setError(err?.response?.data || err?.message || 'Replace failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='edit__text-session'>
      <Typo type='Typo bold'>Icon Edit</Typo>
      <p className='edit-icon__hint'>
        Paste raw SVG markup. Grab one from{' '}
        <a
          href='https://lucide.dev/icons/'
          target='_blank'
          rel='noreferrer'
        >
          lucide.dev
        </a>{' '}
        or{' '}
        <a
          href='https://heroicons.com/'
          target='_blank'
          rel='noreferrer'
        >
          heroicons.com
        </a>
        .
      </p>
      <textarea
        className='edit-icon__textarea'
        rows={6}
        placeholder='<svg viewBox="0 0 24 24" ...>...</svg>'
        value={svg}
        onChange={e => setSvg(e.target.value)}
        disabled={saving}
        maxLength={20000}
      />
      {error && <div className='edit-icon__error'>{error}</div>}
      <button
        type='button'
        className='edit-icon__btn'
        onClick={handleApply}
        disabled={saving || !svg.trim()}
      >
        {saving ? 'Replacing…' : 'Replace icon'}
      </button>
    </div>
  );
}
