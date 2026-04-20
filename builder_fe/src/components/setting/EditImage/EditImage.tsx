import React, { useRef, useState } from 'react';

import { editNode, uploadImage } from '@/axios/page.service';
import Typo from '@/components/commons/Typo';
import { PageNode } from '@/interfaces';

import './editImage.css';

type EditImageProps = {
  pageId: number;
  selectedNode: string;
  nodeData: PageNode;
  onRefreshData: () => Promise<void>;
};

export default function EditImage({ pageId, selectedNode, nodeData, onRefreshData }: EditImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const currentUrl = nodeData.attribute?.value || nodeData.attribute?.src || '';

  const handleFile = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const upRes = await uploadImage(file);
      const newUrl = upRes.data?.url;
      if (!newUrl) throw new Error('Upload returned no URL');

      const updatedNode = {
        ...nodeData,
        attribute: { ...nodeData.attribute, value: newUrl, src: newUrl },
      };
      await editNode(pageId, selectedNode, { node: updatedNode });
      await onRefreshData();
    } catch (err: any) {
      setError(err?.response?.data || err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  return (
    <div className='edit__text-session'>
      <Typo type='Typo bold'>Image Edit</Typo>

      {currentUrl && (
        <div className='edit-image__preview'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className='edit-image__img'
            src={currentUrl}
            alt='current'
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type='file'
        accept='image/png,image/jpeg,image/gif,image/webp,image/svg+xml'
        style={{ display: 'none' }}
        onChange={onInputChange}
      />

      <button
        type='button'
        className='edit-image__btn'
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading…' : 'Upload image'}
      </button>

      {error && <div className='edit-image__error'>{error}</div>}
    </div>
  );
}
