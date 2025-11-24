'use client';

import React, { useEffect, useState } from 'react';

import { userInfo } from '@/axios/auth.service';
import { Page } from '@/interfaces';
import { UserInfoResponse } from '@/interfaces/auth.interface';
import '@/nodeCss/footer.css';
import '@/nodeCss/header.css';
import '@/nodeCss/template.css';

import BodySession from '../BodySession';
import HeaderBar from '../HeaderBar';
import './editPage.css';

export const mockupData: Page = {
  rootNode: 'html-01',
  nodes: {
    'html-01': {
      tag: 'html',
      attribute: { id: '', class: '' },
      children: ['header-02', 'template-09', 'footer-18'],
      devAttribute: { dataId: 'html-01' },
    },

    // header section
    'header-02': {
      tag: 'div',
      attribute: { class: 'header' },
      children: ['div-03', 'div-05'],
      devAttribute: { dataId: 'header-02' },
      builderRender: {
        groupName: 'header',
        renderName: 'Header',
        renderIconName: 'header',
      },
    },
    'div-03': {
      tag: 'div',
      attribute: { class: 'header__content' },
      children: ['div-04'],
      devAttribute: { dataId: 'div-03' },
    },
    'div-04': {
      tag: 'text',
      attribute: { value: 'MyWebsite', class: 'header__title' },
      children: [],
      devAttribute: { dataId: 'div-04' },
      builderRender: {
        renderName: 'Header Title',
        renderIconName: 'text',
      },
    },
    'div-05': {
      tag: 'div',
      attribute: { class: 'header__menu' },
      children: ['div-06'],
      devAttribute: { dataId: 'div-05' },
    },
    'div-06': {
      tag: 'div',
      attribute: { class: 'menu-item' },
      children: ['a-07'],
      devAttribute: { dataId: 'div-06' },
      builderRender: {
        renderName: 'Header Menu',
        renderIconName: 'menu',
      },
    },
    'a-07': {
      tag: 'a',
      attribute: { class: 'menu-link' },
      children: ['text-08'],
      devAttribute: { dataId: 'a-07' },
    },
    'text-08': {
      tag: 'text',
      attribute: { value: 'Home' },
      children: [],
      devAttribute: { dataId: 'text-08' },
      builderRender: {
        renderName: 'Header Menu Text',
        renderIconName: 'text',
      },
    },

    // template section
    'template-09': {
      tag: 'div',
      attribute: { class: 'template' },
      children: ['div-10'],
      devAttribute: { dataId: 'template-09' },
      builderRender: {
        groupName: 'template',
        renderName: 'Template',
        renderIconName: 'template',
      },
    },
    'div-10': {
      tag: 'div',
      attribute: { class: 'hero__content' },
      children: ['div-11', 'div-13'],
      devAttribute: { dataId: 'div-10' },
    },
    'div-11': {
      tag: 'div',
      attribute: { class: 'hero__image__container' },
      children: ['img-12'],
      devAttribute: { dataId: 'div-11' },
    },
    'img-12': {
      tag: 'img',
      attribute: {
        class: 'hero__image',
        value: 'https://i.ibb.co/XrDHM9qq/pexels-thiago-kai-1873845-32394258.jpg',
      },
      children: [],
      devAttribute: { dataId: 'img-12' },
      builderRender: {
        renderName: 'Hero Image',
        renderIconName: 'image',
      },
    },
    'div-13': {
      tag: 'div',
      attribute: { class: 'hero__text__container' },
      children: ['h2-14', 'div-16'],
      devAttribute: { dataId: 'div-13' },
    },
    'h2-14': {
      tag: 'h2',
      attribute: { class: 'hero__title' },
      children: ['text-15'],
      devAttribute: { dataId: 'h2-14' },
    },
    'text-15': {
      tag: 'text',
      attribute: { value: 'Welcome to My Website!' },
      children: [],
      devAttribute: { dataId: 'text-15' },
      builderRender: {
        renderName: 'Hero Title',
        renderIconName: 'text',
      },
    },
    'div-16': {
      tag: 'div',
      attribute: { class: 'hero__subtitle' },
      children: ['text-17'],
      devAttribute: { dataId: 'div-16' },
    },
    'text-17': {
      tag: 'text',
      attribute: { value: 'We are glad to have you here.' },
      children: [],
      devAttribute: { dataId: 'text-17' },
      builderRender: {
        renderName: 'Hero Subtitle',
        renderIconName: 'text',
      },
    },

    // footer section
    'footer-18': {
      tag: 'div',
      attribute: { class: 'footer' },
      children: ['div-19', 'div-21'],
      devAttribute: { dataId: 'footer-18' },
      builderRender: {
        groupName: 'footer',
        renderName: 'Footer',
        renderIconName: 'footer',
      },
    },
    'div-19': {
      tag: 'div',
      attribute: { class: 'footer__top' },
      children: ['text-20'],
      devAttribute: { dataId: 'div-19' },
    },
    'text-20': {
      tag: 'text',
      attribute: { value: 'Contact Us' },
      children: [],
      devAttribute: { dataId: 'text-20' },
      builderRender: {
        renderName: 'Footer Title Text',
        renderIconName: 'text',
      },
    },
    'div-21': {
      tag: 'div',
      attribute: { class: 'footer__bottom' },
      children: ['text-22'],
      devAttribute: { dataId: 'div-21' },
    },
    'text-22': {
      tag: 'text',
      attribute: { value: '© 2025 MyWebsite. All rights reserved.' },
      children: [],
      devAttribute: { dataId: 'text-22' },
      builderRender: {
        renderName: 'Footer Copyright',
        renderIconName: 'text',
      },
    },
  },
};

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
      <BodySession
        mockupData={mockupData}
        pageInfo={data?.pages}
      />

      {/* <AddSectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSection={handleAddSection}
        sectionType={modalSectionType}
      /> */}
    </div>
  );
}
