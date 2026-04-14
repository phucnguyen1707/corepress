import { useState } from 'react';

const IMAGE_EXTS = ['.svg', '.png', '.jpg', '.jpeg'];
const isImage = (file: string) => IMAGE_EXTS.some((ext) => file.includes(ext));

interface SidebarProps {
  groupedFiles: Record<string, string[]>;
  onFileClick: (file: string) => void;
  onAddSite: () => void;
  onToggleChat: () => void;
  chatOpen: boolean;
}

export function Sidebar({
  groupedFiles,
  onFileClick,
  onAddSite,
  onToggleChat,
  chatOpen,
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({});

  const toggleFolder = (folder: string) =>
    setExpandedFolders((prev) => ({ ...prev, [folder]: !prev[folder] }));

  return (
    <aside className="sidebar">
      <div
        className="sidebar-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2>Explorer</h2>
        <button className="add-btn" onClick={onAddSite}>
          + Add site
        </button>
      </div>

      <div className="file-list">
        {Object.entries(groupedFiles).map(([folder, fileList]) => (
          <div key={folder} className="folder-group">
            <div className="folder-title" onClick={() => toggleFolder(folder)}>
              <span
                className={`arrow ${expandedFolders[folder] ? 'open' : ''}`}
              >
                ▶
              </span>
              {folder}
            </div>

            {expandedFolders[folder] && (
              <ul className="file-items">
                {fileList.map((file) => {
                  const clickable = isImage(file);
                  return (
                    <li
                      key={file}
                      onClick={() => clickable && onFileClick(file)}
                      className={clickable ? 'clickable' : 'non-clickable'}
                      style={{
                        cursor: clickable ? 'pointer' : 'default',
                        color: clickable ? '#9cdcfe' : '#666',
                      }}
                    >
                      {file.split('/').pop()}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>

      <button className="chat-toggle-btn" onClick={onToggleChat}>
        {chatOpen ? '✕ Close chat' : '💬 AI Chat'}
      </button>
    </aside>
  );
}
