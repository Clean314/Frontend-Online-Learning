import api from './axios';

export const login = (email, password) =>
  api.post('/login', { username: email, password });

export const logout = () =>
  api.get('/logout');

export const checkAuth = () =>
  api.get('/my-page');