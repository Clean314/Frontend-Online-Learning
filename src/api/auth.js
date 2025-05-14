import api from "./axios";

// 로그인 : 이메일, 비밀번호를 받아서 post 요청
export const login = (email, password) =>
    api.post("/login", { username: email, password });

// 로그아웃
export const logout = () => api.get("/logout");

// 인증 상태 확인
export const checkAuth = () => api.get("/my-page");
