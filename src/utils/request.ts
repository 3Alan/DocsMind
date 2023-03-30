import { message } from 'antd';
import axios from 'axios';
import { isDev } from './isDev';

export const baseURL = isDev ? 'http://127.0.0.1:5000' : import.meta.env.VITE_SERVICES_URL;

const request = axios.create({
  baseURL
});

request.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    message.error(error.response.data.message);
    return Promise.reject(error);
  }
);

export default request;
