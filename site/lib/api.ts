// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // меняй под docker-compose или prod
});

export default api;
