import axios from 'axios';
import config from '../../../config/config';

const apiClient = axios.create({
  baseURL: config.baseApiUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default apiClient;
