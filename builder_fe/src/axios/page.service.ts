import axios from 'axios';

import { SERVICE_ROUTES } from './config';
import { beginSave, endSave } from '@/utils/saveStatus';

export const authAxios = axios.create({
  baseURL: SERVICE_ROUTES.PAGE,
  timeout: 14000,
  headers: { 'Content-Type': 'application/json' },
});

// Every write to a page flows through this instance, so this is the one place that sees them all.
// A GET is a read (loading a page, fetching css, downloading the export) and must not read as
// "saving"; only a mutation does. Marker on the config threads the begin() through to its matching
// end() even when several saves overlap.
const isMutation = (method?: string) =>
  !!method && ['post', 'put', 'patch', 'delete'].includes(method.toLowerCase());

authAxios.interceptors.request.use(config => {
  if (isMutation(config.method)) {
    (config as { __save?: boolean }).__save = true;
    beginSave();
  }
  return config;
});

authAxios.interceptors.response.use(
  response => {
    if ((response.config as { __save?: boolean }).__save) endSave(true);
    return response;
  },
  error => {
    if (error?.config && (error.config as { __save?: boolean }).__save) endSave(false);
    return Promise.reject(error);
  },
);

export const page = (id: number) => {
  return authAxios.get(`/${id}`, { withCredentials: true });
};

export interface TemplateAsset {
  index: number;
  html: string;
  css: string;
}

// The real section files, so the add-section preview shows exactly what will be inserted. Public,
// static design assets — no credentials needed. Lives at `${BASE}/templates`, one level up from the
// `.../page` baseURL, hence the absolute path.
export const getTemplates = () => {
  return authAxios.get<Record<string, TemplateAsset[]>>(
    `${SERVICE_ROUTES.PAGE.replace(/\/page$/, '')}/templates`,
  );
};

// baseURL is already `.../page`, so posting to it hits `POST /page` — the create endpoint.
export const createPage = (name?: string) => {
  return authAxios.post('', name ? { name } : {}, { withCredentials: true });
};

export const renamePage = (id: number, name: string) => {
  return authAxios.patch(`/${id}/rename`, { name }, { withCredentials: true });
};

export const deletePage = (id: number) => {
  return authAxios.delete(`/${id}`, { withCredentials: true });
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

// Reorder a parent's children (move sections up/down). `children` must be a permutation of the
// current children — the backend refuses anything else.
export const reorderChildren = (id: number, parentId: string, children: string[]) => {
  return authAxios.patch(`/${id}/node/${parentId}/reorder`, { children }, { withCredentials: true });
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

// Exports every page the user has. The zip is a binary body, so it must not go through the default
// JSON response transform. `baseUrl` is optional: without a domain we cannot write a canonical URL,
// an og:image or a sitemap, and writing them relative would be worse than leaving them out.
export const exportSite = (baseUrl?: string) => {
  return authAxios.get('/site/export', {
    params: baseUrl ? { baseUrl } : undefined,
    responseType: 'blob',
  });
};
