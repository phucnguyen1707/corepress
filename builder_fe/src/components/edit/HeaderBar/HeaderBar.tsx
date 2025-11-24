'use client';

import React, { useState } from 'react';

import Typo from '@/components/commons/Typo';
import { DesktopIcon, HomeIcon, MobileIcon, ReturnIcon } from '@/icons';
import { EDevices } from '@/interfaces';
import { UserInfo } from '@/interfaces/auth.interface';

import './headerBar.css';

interface HeaderBarProps {
  userInfo: UserInfo | undefined;
}
export default function HeaderBar(props: HeaderBarProps) {
  const { userInfo } = props;
  const [device, setDevice] = useState<EDevices>(EDevices.desktop);
  const [openUserDropdown, setOpenUserDropdown] = useState(false);

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
        <Typo>Website Session</Typo>
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

        <div className='save-button'>Save</div>

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
