'use client';

import React, { useState } from 'react';

import { createPage, deletePage, renamePage } from '@/axios/page.service';
import { UserInfoPage } from '@/interfaces/auth.interface';

import './pageSwitcher.css';

interface PageSwitcherProps {
  pages: UserInfoPage[];
  activePageId: number | undefined;
  onSelect: (id: number) => void;
  // Ask the parent to reload the page list; it returns the fresh list so we can react to it.
  onPagesChanged: () => Promise<UserInfoPage[]>;
}

export default function PageSwitcher(props: PageSwitcherProps) {
  const { pages, activePageId, onSelect, onPagesChanged } = props;

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState('');

  const activePage = pages.find(page => page.id === activePageId);

  const handleCreate = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await createPage('New Page');
      const fresh = await onPagesChanged();
      const created = fresh.find(page => page.id === res.data.id);
      if (created) onSelect(created.id);
    } catch {
      setError('Could not create a page.');
    } finally {
      setBusy(false);
    }
  };

  const startRename = (page: UserInfoPage) => {
    setRenamingId(page.id);
    setDraftName(page.name);
    setError(null);
  };

  const commitRename = async () => {
    if (renamingId == null) return;
    const name = draftName.trim();
    if (!name) {
      setRenamingId(null);
      return;
    }
    setBusy(true);
    try {
      await renamePage(renamingId, name);
      await onPagesChanged();
    } catch {
      setError('Could not rename that page.');
    } finally {
      setBusy(false);
      setRenamingId(null);
    }
  };

  const handleDelete = async (page: UserInfoPage) => {
    if (busy) return;
    // The server refuses to delete a user's only page; don't even offer it here.
    if (pages.length <= 1) {
      setError('A site needs at least one page.');
      return;
    }
    if (!window.confirm(`Delete “${page.name}”? This cannot be undone.`)) return;

    setBusy(true);
    setError(null);
    try {
      await deletePage(page.id);
      const fresh = await onPagesChanged();
      // If the page we were editing is gone, move to whatever remains.
      if (page.id === activePageId && fresh[0]) onSelect(fresh[0].id);
    } catch {
      setError('Could not delete that page.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className='page-switcher'>
      <button
        type='button'
        className='page-switcher__current'
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className='page-switcher__label'>{activePage?.name ?? 'Pages'}</span>
        <span className='page-switcher__count'>{pages.length}</span>
      </button>

      {open && (
        <div className='page-switcher__menu'>
          <ul className='page-switcher__list'>
            {pages.map(page => (
              <li
                key={page.id}
                className={`page-switcher__item ${page.id === activePageId ? 'is-active' : ''}`}
              >
                {renamingId === page.id ? (
                  <input
                    className='page-switcher__rename'
                    value={draftName}
                    autoFocus
                    onChange={e => setDraftName(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitRename();
                      if (e.key === 'Escape') setRenamingId(null);
                    }}
                  />
                ) : (
                  <button
                    type='button'
                    className='page-switcher__pick'
                    onClick={() => {
                      onSelect(page.id);
                      setOpen(false);
                    }}
                  >
                    {page.name}
                  </button>
                )}

                <span className='page-switcher__actions'>
                  <button
                    type='button'
                    className='page-switcher__action'
                    title='Rename'
                    onClick={() => startRename(page)}
                  >
                    Rename
                  </button>
                  <button
                    type='button'
                    className='page-switcher__action page-switcher__action--danger'
                    title='Delete'
                    disabled={pages.length <= 1}
                    onClick={() => handleDelete(page)}
                  >
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>

          {error && <p className='page-switcher__error'>{error}</p>}

          <button
            type='button'
            className='page-switcher__add'
            onClick={handleCreate}
            disabled={busy}
          >
            + New page
          </button>
        </div>
      )}
    </div>
  );
}
