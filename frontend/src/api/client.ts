import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust if backend port differs
});

export default api;
