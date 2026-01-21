import axios from 'axios';

import { SERVICE_ROUTES } from './config';

export const authAxios = axios.create({
  baseURL: SERVICE_ROUTES.PAGE,
  timeout: 14000,
  headers: { 'Content-Type': 'application/json' },
});

export const page = (id: number) => {
  return authAxios.get(`/${id}`, { withCredentials: true });
};

export const addSection = (id: number, sectionType: string, templateIndex: number, nodeId: string) => {
  return authAxios.post(
    `/${id}/section/add/${sectionType}/${templateIndex}/node/${nodeId}`,
    {},
    { withCredentials: true }
  );
};
