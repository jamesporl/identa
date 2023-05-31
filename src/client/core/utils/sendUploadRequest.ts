import axios from 'axios';
import { AUTH_TOKEN_KEY } from './storageKeys';

const uploadsUrl = process.env.UPLOADS_URL || 'http://localhost:3111/uploads';

let authToken = '';
if (typeof window !== 'undefined') {
  authToken = localStorage.getItem(AUTH_TOKEN_KEY) || '';
}

const config = {
  headers: {
    Authorization: authToken,
  },
};

export default async function sendUploadRequest(endpoint: string, data: any) {
  await axios.post(
    `${uploadsUrl}${endpoint}`,
    data,
    config,
  );
}
