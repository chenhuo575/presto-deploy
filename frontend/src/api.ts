import config from '../backend.config.json';
import type { Store } from './types';

const BASE_URL = `http://localhost:${config.BACKEND_PORT}`;

const getToken = () => localStorage.getItem('token') ?? '';

export const getStore = async (): Promise<Store> => {
  const res = await fetch(`${BASE_URL}/store`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return {
    presentations: data.store?.presentations ?? [],
  };
};

export const putStore = async (store: Store): Promise<void> => {
  const res = await fetch(`${BASE_URL}/store`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ store }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
};