import axios from 'axios';

// Create instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // Replace with your real backend API
  timeout: 10000,
  withCredentials: true, // Allow cookies / auth headers to be sent cross-origin
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;