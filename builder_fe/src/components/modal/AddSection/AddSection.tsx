import React, { useState } from 'react';

import Typo from '@/components/commons/Typo';

import './addSection.css';

interface AddSectionModalInterface {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (section: unknown) => void;
  sectionType: string;
}

const AddSectionModal = ({ isOpen, onClose, onAddSection, sectionType }: AddSectionModalInterface) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Sections');

  const sections = [
    {
      id: 'hero',
      name: 'Hero',
      description: 'Large banner section',
      icon: '🎯',
      category: 'Banners',
    },
    {
      id: 'hero-bottom',
      name: 'Hero: Bottom aligned',
      description: 'Hero with content at bottom',
      icon: '🎯',
      category: 'Banners',
    },
    {
      id: 'hero-marquee',
      name: 'Hero: Marquee',
      description: 'Scrolling hero section',
      icon: '🎯',
      category: 'Banners',
    },
    {
      id: 'large-logo',
      name: 'Large logo',
      description: 'Prominent logo display',
      icon: '🏢',
      category: 'Banners',
    },
    {
      id: 'slideshow',
      name: 'Slideshow',
      description: 'Image carousel',
      icon: '🖼️',
      category: 'Banners',
    },
    {
      id: 'split-showcase',
      name: 'Split showcase',
      description: 'Two column layout',
      icon: '📐',
      category: 'Banners',
    },
    {
      id: 'collection-spotlight',
      name: 'Collection links: Spotlight',
      description: 'Featured collections',
      icon: '🔗',
      category: 'Collections',
    },
    {
      id: 'collection-text',
      name: 'Collection links: Text',
      description: 'Text-based collection links',
      icon: '📝',
      category: 'Collections',
    },
    {
      id: 'collection-bento',
      name: 'Collection list: Bento',
      description: 'Grid layout collections',
      icon: '📦',
      category: 'Collections',
    },
    {
      id: 'collection-carousel',
      name: 'Collection list: Carousel',
      description: 'Scrolling collections',
      icon: '🎠',
      category: 'Collections',
    },
  ];

  const filteredSections = sections.filter(
    section =>
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedSections = filteredSections.reduce(
    (acc, section) => {
      (acc[section.category] = acc[section.category] || []).push(section);
      return acc;
    },
    // eslint-disable-next-line
    {} as Record<string, { id: string; name: string; description: string; icon: string; category: string }[]>
  );

  return (
    <>
      {isOpen ? (
        <div
          className='modal-overlay'
          onClick={onClose}
        >
          <div
            className='modal-content'
            onClick={e => e.stopPropagation()}
          >
            <div className='modal-header'>
              <div>
                <Typo className='modal-title'>Pick session here</Typo>
              </div>
              <button
                className='close-button'
                onClick={onClose}
              >
                X Icon here
              </button>
            </div>

            <div className='modal-search'>
              <input
                type='text'
                placeholder='Search sections'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='search-input'
              />
            </div>

            <div className='modal-tabs'>
              <button
                className={`tab ${activeTab === 'Sections' ? 'active' : ''}`}
                onClick={() => setActiveTab('Sections')}
              >
                Sections
              </button>
              <button
                className={`tab ${activeTab === 'Apps' ? 'active' : ''}`}
                onClick={() => setActiveTab('Apps')}
              >
                Apps
              </button>
            </div>

            <div className='modal-body'>
              {Object.entries(groupedSections).map(([category, items]) => (
                <div
                  key={category}
                  className='section-group'
                >
                  <h3 className='category-title'>{category}</h3>
                  <div className='section-list'>
                    {items.map(section => (
                      <button
                        key={section.id}
                        className='section-item'
                        onClick={() => {
                          onAddSection(section);
                          onClose();
                        }}
                      >
                        <span className='section-icon'>{section.icon}</span>
                        <span className='section-name'>{section.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AddSectionModal;
