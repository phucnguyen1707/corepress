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

export const cssPage = (id: number) => {
  return authAxios.get(`/${id}/css`, { withCredentials: true });
};

export const addSection = (id: number, sectionType: string, templateIndex: number, nodeId: string) => {
  return authAxios.post(
    `/${id}/section/add/${sectionType}/${templateIndex}/node/${nodeId}`,
    {},
    { withCredentials: true }
  );
};

export const editNode = (id: number, nodeId: string, node: object) => {
  return authAxios.post(`/${id}/node/edit/${nodeId}`, node, { withCredentials: true });
};

export const deleteNode = (id: number, nodeId: string) => {
  return authAxios.post(`/${id}/node/delete/${nodeId}`, {}, { withCredentials: true });
};

export const editCss = (id: number, objectCss: object) => {
  return authAxios.post(`/${id}/edit/css`, objectCss, { withCredentials: true });
};

export const aiGenerateSection = (
  id: number,
  payload: { prompt: string; sectionType: string; nodeId: string }
) => {
  return authAxios.post(`/${id}/ai/section/generate`, payload, {
    withCredentials: true,
    timeout: 60000,
  });
};

export const replaceIcon = (id: number, nodeId: string, svg: string) => {
  return authAxios.post(
    `/${id}/icon/replace/${nodeId}`,
    { svg },
    { withCredentials: true }
  );
};

export const uploadImage = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return axios.post('http://localhost:8000/upload/image', form, {
    withCredentials: true,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
