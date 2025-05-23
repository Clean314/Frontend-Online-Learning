import axios from "axios";

// REST API 사용을 위해 기본 설정을 가진 axios 객체 설정
const api = axios.create({
    baseURL: "http://localhost:8080", // 요청 기본 주소
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청 시 토큰 자동 삽입 (/auth/* 요청 제외)
// interceptors : 요청이 보내지기 전에 가로채서 특정 작업을 수행
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");

    if (token && token !== "undefined" && !config.url.startsWith("/auth/")) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
