import axios from 'axios';

const api = axios.create({
  baseURL: 'https://6aeaab213d3dd3d37be6f176.mockapi.io/experiences',
  timeout: 10000,
});

export default api;
