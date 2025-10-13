'use client';

import React, { useState } from 'react';

import Typo from '@/components/commons/Typo';
import { DesktopIcon } from '@/icons/D';
import { HomeIcon } from '@/icons/H';
import { MobileIcon } from '@/icons/M';
import { ReturnIcon } from '@/icons/R';
import { SessionIcon, SettingIcon } from '@/icons/S';
import { EDevices, ESideBarActive } from '@/interfaces/common';
import { useTranslations } from 'next-intl';

import './editPage.scss';

export default function LoginPage() {
  const t = useTranslations('Login');

  const [device, setDevice] = useState<EDevices>(EDevices.desktop);
  const [activeAction, setActiveAction] = useState<ESideBarActive>(ESideBarActive.session);

  return (
    <div className='edit-page'>
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
        </div>
      </div>
      <div className='body-session'>
        <div className='first-section'>
          <div className='action-bar'>
            <div
              className={`action-item ${activeAction === ESideBarActive.session ? 'active' : ''}`}
              onClick={() => setActiveAction(ESideBarActive.session)}
            >
              <SessionIcon />
            </div>
            <div
              className={`action-item ${activeAction === ESideBarActive.setting ? 'active' : ''}`}
              onClick={() => setActiveAction(ESideBarActive.setting)}
            >
              <SettingIcon />
            </div>
          </div>
          <div className='section-content'>2</div>
        </div>
        <div className='second-section'>123213</div>
      </div>
    </div>
  );
}
