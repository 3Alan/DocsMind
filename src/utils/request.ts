import { message } from 'antd';
import axios from 'axios';

const request = axios.create({
  baseURL: 'http://127.0.0.1:5000'
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
