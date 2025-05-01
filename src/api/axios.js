import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8070', // 또는 실제 서버 주소
  withCredentials: true, // 중요!
});

export default api;