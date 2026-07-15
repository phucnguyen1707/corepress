'use client';

import React, { ReactNode, useState } from 'react';

import { exportSite } from '@/axios/page.service';
import Typo from '@/components/commons/Typo';
import { DesktopIcon, HomeIcon, MobileIcon, ReturnIcon } from '@/icons';
import { EDevices } from '@/interfaces';
import { UserInfo } from '@/interfaces/auth.interface';
import { useSaveStatus } from '@/utils/saveStatus';

import './headerBar.css';

const SAVE_LABEL: Record<string, string> = {
  idle: 'All changes saved',
  saving: 'Saving…',
  saved: 'All changes saved',
  error: 'Save failed — retrying on next change',
};

interface HeaderBarProps {
  userInfo: UserInfo | undefined;
  pageSwitcher?: ReactNode;
}

export default function HeaderBar(props: HeaderBarProps) {
  const { userInfo, pageSwitcher } = props;
  const [device, setDevice] = useState<EDevices>(EDevices.desktop);
  const [openUserDropdown, setOpenUserDropdown] = useState(false);
  const saveState = useSaveStatus();

  const [openExport, setOpenExport] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (exporting) return;

    setExporting(true);
    setError(null);

    try {
      const res = await exportSite(baseUrl.trim() || undefined);

      const disposition = String(res.headers['content-disposition'] ?? '');
      const filename = disposition.match(/filename="([^"]+)"/)?.[1] ?? 'site.zip';

      const url = URL.createObjectURL(res.data as Blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      setOpenExport(false);
    } catch {
      setError('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className='header-session'>
      <div className='every-session'>
        <div className='icon-size'>
          <ReturnIcon />
        </div>
        <Typo>Website Name</Typo>
      </div>

      <div className='every-session'>
        <div className='icon-size'>
          <HomeIcon />
        </div>
        {pageSwitcher ?? <Typo>Website Session</Typo>}
      </div>

      <div className='every-session'>
        <div className='device-choose'>
          <div className={`device-background ${device === EDevices.desktop ? 'active' : ''}`}>
            <div
              className='device-icon'
              onClick={() => setDevice(EDevices.desktop)}
            >
              <DesktopIcon />
            </div>
          </div>

          <div className={`device-background ${device === EDevices.mobile ? 'active' : ''}`}>
            <div
              className='device-icon'
              onClick={() => setDevice(EDevices.mobile)}
            >
              <MobileIcon />
            </div>
          </div>
        </div>

        <div className='export-wrap'>
          <button
            type='button'
            className='export-button'
            onClick={() => setOpenExport(!openExport)}
            aria-expanded={openExport}
          >
            Export
          </button>

          {openExport && (
            <div className='export-panel'>
              <p className='export-panel__lead'>
                Downloads your whole site as plain HTML and CSS. It runs anywhere — no server, no
                account, no link back to this app.
              </p>

              <label
                className='export-panel__label'
                htmlFor='export-base-url'
              >
                Site URL <span>(optional)</span>
              </label>
              <input
                id='export-base-url'
                className='export-panel__input'
                type='url'
                placeholder='https://myshop.com'
                value={baseUrl}
                onChange={e => setBaseUrl(e.target.value)}
              />
              <p className='export-panel__hint'>
                Needed for the sitemap and social share previews. Leave it blank and those are simply
                left out, rather than written wrong.
              </p>

              {error && <p className='export-panel__error'>{error}</p>}

              <button
                type='button'
                className='export-panel__go'
                onClick={handleExport}
                disabled={exporting}
              >
                {exporting ? 'Preparing…' : 'Download .zip'}
              </button>
            </div>
          )}
        </div>

        {/* Not a button: the builder saves on its own. This just tells the user it happened —
            which is the honest version of the dead "Save" control that used to sit here. */}
        <div
          className={`save-status save-status--${saveState}`}
          role='status'
          aria-live='polite'
        >
          <span className='save-status__dot' aria-hidden='true' />
          {SAVE_LABEL[saveState]}
        </div>

        <div className='user-dropdown'>
          <div
            className='user-selected'
            onClick={() => setOpenUserDropdown(!openUserDropdown)}
          >
            <span>{userInfo && userInfo.name ? userInfo.name : 'Loading...'}</span>
          </div>

          {openUserDropdown && userInfo && (
            <div className='user-dropdown-menu'>
              <div className='user-line'>
                <strong>{userInfo.name}</strong>
              </div>
              <div className='user-line'>{userInfo.email}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
