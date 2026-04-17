import { useState } from 'react';

const CATEGORIES: {
  key: string;
  label: string;
  color: string;
  extensions: string[];
}[] = [
  {
    key: 'html',
    label: 'HTML',
    color: '#e44d26',
    extensions: ['.html', '.htm'],
  },
  { key: 'css', label: 'CSS', color: '#264de4', extensions: ['.css'] },
  {
    key: 'js',
    label: 'JavaScript',
    color: '#f7df1e',
    extensions: ['.js', '.mjs'],
  },
  {
    key: 'images',
    label: 'Images',
    color: '#3fb950',
    extensions: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'],
  },
  {
    key: 'fonts',
    label: 'Fonts',
    color: '#a371f7',
    extensions: ['.woff', '.woff2', '.ttf', '.eot', '.otf'],
  },
];

function categorizeFile(file: string): string {
  const lower = file.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.extensions.some((ext) => lower.endsWith(ext))) return cat.key;
  }
  return '';
}

function isToggleable(category: string): boolean {
  return ['css', 'js', 'images', 'fonts'].includes(category);
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface FileInfo {
  path: string;
  size: number;
  sourcePath: string;
  enabled: boolean;
}

interface SidebarProps {
  files: FileInfo[];
  onFileDetail: (file: FileInfo) => void;
  onToggleFile: (file: string, enabled: boolean) => void;
  onAddSite: () => void;
  onToggleChat: () => void;
  chatOpen: boolean;
}

export function Sidebar({
  files,
  onFileDetail,
  onToggleFile,
  onAddSite,
  onToggleChat,
  chatOpen,
}: SidebarProps) {
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');

  // Group all files by category, filtering by search
  const grouped: Record<string, FileInfo[]> = {};
  for (const file of files) {
    const name = file.path.toLowerCase();
    if (search && !name.includes(search.toLowerCase())) continue;
    const cat = categorizeFile(file.path);
    if (!cat) continue; // skip uncategorized
    (grouped[cat] ??= []).push(file);
  }

  const toggleCat = (key: string) =>
    setExpandedCats((prev) => ({ ...prev, [key]: !prev[key] }));

  const totalFiles = files.length;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Explorer</h2>
        <div className="sidebar-header-right">
          <span className="total-badge">{totalFiles} files</span>
          <button className="add-btn" onClick={onAddSite}>
            + Add
          </button>
        </div>
      </div>

      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>
            ✕
          </button>
        )}
      </div>

      <div className="file-list">
        {CATEGORIES.map((cat) => {
          const catFiles = grouped[cat.key];
          if (!catFiles || catFiles.length === 0) return null;
          const isOpen = expandedCats[cat.key];
          const canToggle = isToggleable(cat.key);

          return (
            <div key={cat.key} className="category-group">
              <div
                className="category-title"
                onClick={() => toggleCat(cat.key)}
              >
                <span className={`arrow ${isOpen ? 'open' : ''}`}>▶</span>
                <span className="cat-dot" style={{ background: cat.color }} />
                <span className="cat-label">{cat.label}</span>
                <span className="file-count">{catFiles.length}</span>
              </div>

              {isOpen && (
                <ul className="file-items">
                  {catFiles.map((file) => {
                    const fileName = file.path.split('/').pop() || '';
                    const isEnabled = file.enabled;
                    return (
                      <li
                        key={file.path}
                        className={`file-item ${isEnabled ? '' : 'file-disabled'}`}
                      >
                        {canToggle && (
                          <label
                            className="file-toggle"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={(e) =>
                                onToggleFile(file.path, e.target.checked)
                              }
                            />
                            <span className="toggle-slider" />
                          </label>
                        )}
                        {!canToggle && (
                          <span
                            className="file-dot"
                            style={{ background: cat.color }}
                          />
                        )}
                        <span
                          className="file-name"
                          onClick={() => onFileDetail(file)}
                          title={file.sourcePath}
                        >
                          {fileName}
                        </span>
                        {file.size > 0 && (
                          <span className="file-size">
                            {formatSize(file.size)}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}

        {totalFiles === 0 && (
          <div className="sidebar-empty">
            No files yet. Scrape a site to begin.
          </div>
        )}
      </div>

      <button className="chat-toggle-btn" onClick={onToggleChat}>
        {chatOpen ? '✕ Close chat' : '💬 AI Chat'}
      </button>
    </aside>
  );
}
