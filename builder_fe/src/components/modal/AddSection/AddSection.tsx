import React, { useState } from 'react';

import Typo from '@/components/commons/Typo';
import { TemplateSessionIcon } from '@/icons';

import './addSection.css';

interface AddSectionModalInterface {
  isOpen: boolean;
  onClose: () => void;
  // onAddSection: (section: unknown) => void;
  sectionType: string;
}

export interface SectionInterface {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

const AddSectionModal = ({ isOpen, onClose, sectionType }: AddSectionModalInterface) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Sections');

  const sections: SectionInterface[] = [
    {
      id: 'hero',
      name: 'Hero',
      description: 'Large banner section',
      category: 'Banners',
      icon: <TemplateSessionIcon />,
    },
  ];

  const filteredSections = sections.filter(
    section =>
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedSections = filteredSections.reduce<Record<string, SectionInterface[]>>((acc, section) => {
    (acc[section.category] = acc[section.category] || []).push(section);
    return acc;
  }, {});

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
                X
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
          <div></div>
        </div>
      ) : null}
    </>
  );
};

export default AddSectionModal;
