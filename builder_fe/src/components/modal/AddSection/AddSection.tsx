import React, { useState } from 'react';

import { addSection } from '@/axios/page.service';
import { allSections } from '@/utils/mockupData';

import './addSection.css';

interface AddSectionModalInterface {
  isOpen: boolean;
  pageId: number | undefined;
  onClose: () => void;
  sectionType: string;
  onRefreshData: () => Promise<void>;
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

const AddSectionModal = ({ isOpen, onClose, sectionType, pageId = 0, onRefreshData }: AddSectionModalInterface) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Sections');
  const [isAdding, setIsAdding] = useState(false);

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

  const handleAddSection = async (section: SectionInterface) => {
    if (isAdding) return;

    setIsAdding(true);

    const sectionType = section.id.split('-')[0];
    const templateIndex = Number(section.id.split('-')[1]);

    try {
      const res = await addSection(pageId, sectionType, templateIndex, 'div-01');
      if (res.status === 200) {
        onRefreshData();
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };
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
                        onMouseEnter={() => {
                          setHoverHtml(section.html);
                          setHoverCss(section.css);
                        }}
                        onMouseLeave={() => {
                          setHoverHtml(hoverHtml);
                          setHoverCss(hoverCss);
                        }}
                        onClick={() => handleAddSection(section)}
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

          <div
            className='preview-wrapper'
            onClick={e => e.stopPropagation()}
          >
            {hoverCss && <style>{hoverCss}</style>}

            <div
              className='preview-viewport'
              dangerouslySetInnerHTML={{ __html: hoverHtml }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AddSectionModal;
