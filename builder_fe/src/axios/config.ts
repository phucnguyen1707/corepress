const BASE_API_URL = 'http://localhost:8000';

export const SERVICE_ROUTES = {
  AUTH: `${BASE_API_URL}/auth`,
  PAGE: `${BASE_API_URL}/page`,
} as const;
