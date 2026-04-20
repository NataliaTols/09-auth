import axios from 'axios';

export const nextServer = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || 'https://notehub-api.goit.study') + '/api',
  withCredentials: true,
});