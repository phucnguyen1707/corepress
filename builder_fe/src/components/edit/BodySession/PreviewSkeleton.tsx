import React from 'react';

import './previewSkeleton.css';

export default function PreviewSkeleton() {
  return (
    <div className='preview-skeleton'>
      <div className='preview-skeleton__header'>
        <div className='preview-skeleton__logo'>
          <div className='preview-skeleton__logo-dot shimmer' />
          <div className='preview-skeleton__logo-text shimmer' />
        </div>
        <div className='preview-skeleton__nav'>
          <div className='preview-skeleton__nav-item shimmer' />
          <div className='preview-skeleton__nav-item shimmer' />
          <div className='preview-skeleton__nav-item shimmer' />
          <div className='preview-skeleton__nav-item shimmer' />
        </div>
        <div className='preview-skeleton__actions'>
          <div className='preview-skeleton__icon shimmer' />
          <div className='preview-skeleton__icon shimmer' />
        </div>
      </div>

      <div className='preview-skeleton__body'>
        <div className='preview-skeleton__hero'>
          <div className='preview-skeleton__hero-text'>
            <div className='preview-skeleton__title shimmer' />
            <div className='preview-skeleton__subtitle shimmer' />
            <div className='preview-skeleton__paragraph shimmer' />
            <div className='preview-skeleton__paragraph preview-skeleton__paragraph--short shimmer' />
            <div className='preview-skeleton__cta shimmer' />
          </div>
          <div className='preview-skeleton__hero-image shimmer' />
        </div>

        <div className='preview-skeleton__cards'>
          <div className='preview-skeleton__card shimmer' />
          <div className='preview-skeleton__card shimmer' />
          <div className='preview-skeleton__card shimmer' />
        </div>
      </div>

      <div className='preview-skeleton__footer'>
        <div className='preview-skeleton__footer-col'>
          <div className='preview-skeleton__footer-title shimmer' />
          <div className='preview-skeleton__footer-line shimmer' />
          <div className='preview-skeleton__footer-line shimmer' />
          <div className='preview-skeleton__footer-line shimmer' />
        </div>
        <div className='preview-skeleton__footer-col'>
          <div className='preview-skeleton__footer-title shimmer' />
          <div className='preview-skeleton__footer-line shimmer' />
          <div className='preview-skeleton__footer-line shimmer' />
          <div className='preview-skeleton__footer-line shimmer' />
        </div>
        <div className='preview-skeleton__footer-col'>
          <div className='preview-skeleton__footer-title shimmer' />
          <div className='preview-skeleton__footer-line shimmer' />
          <div className='preview-skeleton__footer-line shimmer' />
          <div className='preview-skeleton__footer-line shimmer' />
        </div>
      </div>
    </div>
  );
}
