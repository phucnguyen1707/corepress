'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { userInfo } from '@/axios/auth.service';
import { UserInfo, UserInfoPage } from '@/interfaces/auth.interface';
import '@/nodeCss/footer.css';
import '@/nodeCss/header.css';
import '@/nodeCss/template.css';

import BodySession from '../BodySession';
import HeaderBar from '../HeaderBar';
import PageSwitcher from '../PageSwitcher/PageSwitcher';
import './editPage.css';

export default function EditPage() {
  const [user, setUser] = useState<UserInfo | undefined>(undefined);
  const [pages, setPages] = useState<UserInfoPage[]>([]);
  const [activePageId, setActivePageId] = useState<number | undefined>(undefined);

  // Reloads the page list and returns it, so callers (create/delete) can pick a page from the fresh
  // result rather than from stale state.
  const loadPages = useCallback(async (): Promise<UserInfoPage[]> => {
    const res = await userInfo();
    setUser(res.data.user);
    setPages(res.data.pages);
    return res.data.pages;
  }, []);

  useEffect(() => {
    loadPages()
      .then(fresh => {
        // Land on the first page the first time; leave the choice alone on later refreshes.
        setActivePageId(current => current ?? fresh[0]?.id);
      })
      .catch(err => console.error('Failed to load user info:', err));
  }, [loadPages]);

  return (
    <div className='edit-page'>
      <HeaderBar
        userInfo={user}
        pageSwitcher={
          <PageSwitcher
            pages={pages}
            activePageId={activePageId}
            onSelect={setActivePageId}
            onPagesChanged={loadPages}
          />
        }
      />
      <BodySession pageId={activePageId} />
    </div>
  );
}
