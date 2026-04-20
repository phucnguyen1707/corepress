import React, { useState } from 'react';

import { addSection, aiGenerateSection } from '@/axios/page.service';
import Switch from '@/components/commons/Switch';
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

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

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

  const handleGenerateAi = async () => {
    if (aiLoading || !aiPrompt.trim()) return;

    setAiLoading(true);
    setAiError('');

    try {
      const res = await aiGenerateSection(pageId, {
        prompt: aiPrompt.trim(),
        sectionType: sectionType.toLocaleLowerCase(),
        nodeId: 'div-01',
      });
      if (res.status === 200) {
        await onRefreshData();
        setAiPrompt('');
        onClose();
      } else {
        setAiError('Generation failed. Please try again.');
      }
    } catch (error: any) {
      const msg = error?.response?.data || error?.message || 'Generation failed';
      setAiError(String(msg));
    } finally {
      setAiLoading(false);
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

            <Switch
              options={[
                { label: 'Sections', value: 'Sections' },
                { label: 'AI', value: 'AI' },
                { label: 'Apps', value: 'Apps' },
              ]}
              value={activeTab}
              onChange={setActiveTab}
            />

            <div className='modal-body'>
              {activeTab === 'Sections' &&
                Object.entries(groupedSections).map(([category, items]) => (
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
                          onClick={() => handleAddSection(section)}
                        >
                          <span className='section-icon'>{section.icon}</span>
                          <span className='section-name'>{section.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

              {activeTab === 'AI' && (
                <div className='ai-panel'>
                  <h3 className='category-title'>Generate with AI</h3>
                  <p className='ai-hint'>
                    Describe the {sectionType.toLowerCase()} you want. Keep it specific — mention style,
                    colors, and what it should contain.
                  </p>
                  <textarea
                    className='ai-textarea'
                    placeholder={`e.g. a modern ${sectionType.toLowerCase()} with a gradient background, bold heading, and a call-to-action button`}
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    rows={6}
                    maxLength={1000}
                    disabled={aiLoading}
                  />
                  <div className='ai-meta'>
                    <span>{aiPrompt.length} / 1000</span>
                  </div>
                  {aiError && <div className='ai-error'>{aiError}</div>}
                  <button
                    className='ai-generate-btn'
                    onClick={handleGenerateAi}
                    disabled={aiLoading || !aiPrompt.trim()}
                  >
                    {aiLoading ? 'Generating…' : 'Generate'}
                  </button>
                </div>
              )}

              {activeTab === 'Apps' && (
                <div className='ai-panel'>
                  <p className='ai-hint'>Apps coming soon.</p>
                </div>
              )}
            </div>
          </div>

          <div
            className='preview-wrapper'
            onClick={e => e.stopPropagation()}
          >
            {activeTab === 'AI' ? (
              <div className='ai-preview-empty'>
                {aiLoading ? (
                  <>
                    <div className='ai-spinner' />
                    <div>Generating your section…</div>
                    <div className='ai-preview-hint'>This usually takes a few seconds.</div>
                  </>
                ) : (
                  <>
                    <div className='ai-preview-title'>AI-powered section generation</div>
                    <div className='ai-preview-hint'>
                      Type what you want on the left, then hit Generate. The section will be added to your page.
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                {hoverCss && <style>{hoverCss}</style>}
                <div
                  className='preview-viewport'
                  dangerouslySetInnerHTML={{ __html: hoverHtml }}
                />
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default AddSectionModal;
