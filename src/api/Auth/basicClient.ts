// basicClient.js
import axios from 'axios';
import config from '../../config';

const basicClient = axios.create({
  baseURL: config.API_URL,
  timeout: 5000,
});

basicClient.interceptors.request.use(
  (request) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default basicClient;
