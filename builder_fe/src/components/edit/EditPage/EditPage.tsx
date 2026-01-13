'use client';

import React, { useEffect, useState } from 'react';

import { userInfo } from '@/axios/auth.service';
import { UserInfoResponse } from '@/interfaces/auth.interface';
import '@/nodeCss/footer.css';
import '@/nodeCss/header.css';
import '@/nodeCss/template.css';

import BodySession from '../BodySession';
import HeaderBar from '../HeaderBar';
import './editPage.css';

export default function EditPage() {
  const [data, setData] = useState<UserInfoResponse | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userInfo();

        setData(res.data);
      } catch (err) {
        console.error('Failed to load user info:', err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className='edit-page'>
      <HeaderBar userInfo={data?.user} />
      <BodySession pageInfo={data?.pages} />
    </div>
  );
}
