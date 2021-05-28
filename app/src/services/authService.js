import apiClient from '@/services/helpers/apiClient';

export default {
  register(credentials) {
    return apiClient.post('/api/auth/register', credentials);
  },
  login(credentials) {
    return apiClient.post('/api/auth/login', credentials);
  },
};
