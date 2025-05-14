import axios from "axios";

// REST API 사용을 위해 기본 설정을 가진 axios 객체 생성
const api = axios.create({
    baseURL: "http://localhost:8080", // 요청 기본 주소
    withCredentials: true, // 로그인 상태 유지를 위해 쿠키 자동으로 주고 받도록 설정
});

export default api;
