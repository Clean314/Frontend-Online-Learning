// src/api/auth.js
import api from './axios';

export async function checkAuthenticated() {
  try {
    const res = await api.get('/my-page'); // 인증 필요한 경로
    return res.status === 200;
  } catch {
    return false;
  }
}
