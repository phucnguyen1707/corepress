import React, { useState } from 'react';

import { allSections } from '@/utils/mockupData';

import './addSection.css';

interface AddSectionModalInterface {
  isOpen: boolean;
  onClose: () => void;
  sectionType: string;
}

export interface SectionInterface {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  html: string;
  css: string;
}

const AddSectionModal = ({ isOpen, onClose, sectionType }: AddSectionModalInterface) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Sections');

  const [hoverHtml, setHoverHtml] = useState('');
  const [hoverCss, setHoverCss] = useState('');

  const sections = allSections[sectionType.toLocaleLowerCase()] || [];

  const filteredSections = sections.filter(section => {
    const keyword = searchTerm.toLowerCase();
    return section.name.toLowerCase().includes(keyword) || section.description.toLowerCase().includes(keyword);
  });

  const groupedSections = filteredSections.reduce<Record<string, SectionInterface[]>>((acc, section) => {
    if (!acc[section.category]) acc[section.category] = [];
    acc[section.category].push(section);
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
            <div className='modal-search'>
              <input
                type='text'
                placeholder='Search sections'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='search-input'
              />
            </div>

            <div className='switch__container'>
              <div
                className={`switch__button ${activeTab === 'Sections' ? 'active' : ''}`}
                onClick={() => setActiveTab('Sections')}
              >
                Sections
              </div>
              <div
                className={`switch__button ${activeTab === 'Apps' ? 'active' : ''}`}
                onClick={() => setActiveTab('Apps')}
              >
                Apps
              </div>
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
                        onClick={onClose}
                        onMouseEnter={() => {
                          setHoverHtml(section.html);
                          setHoverCss(section.css);
                        }}
                        onMouseLeave={() => {
                          setHoverHtml(hoverHtml);
                          setHoverCss(hoverCss);
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

          <div className='preview-content'>
            {hoverCss && <style>{hoverCss}</style>}

            <div
              className='preview-frame'
              dangerouslySetInnerHTML={{ __html: hoverHtml }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AddSectionModal;
