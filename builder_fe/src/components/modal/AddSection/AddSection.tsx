import React, { useState } from 'react';

import Typo from '@/components/commons/Typo';
import { TemplateSessionIcon } from '@/icons';

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

const AddSectionModal = ({ isOpen, onClose }: AddSectionModalInterface) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Sections');

  const [hoverHtml, setHoverHtml] = useState('');
  const [hoverCss, setHoverCss] = useState('');

  const sections: SectionInterface[] = [
    {
      id: 'hero',
      name: 'Hero',
      description: 'Large banner section',
      category: 'Banners',
      icon: <TemplateSessionIcon />,
      html: "<div class='hero-sec'>Hero Preview</div>",
      css: '.hero-sec { padding: 40px; background: gold; font-size: 28px; }',
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
              <div
                className={`tab ${activeTab === 'Sections' ? 'active' : ''}`}
                onClick={() => setActiveTab('Sections')}
              >
                Sections
              </div>
              <div
                className={`tab ${activeTab === 'Apps' ? 'active' : ''}`}
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

          {/* PREVIEW */}
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
