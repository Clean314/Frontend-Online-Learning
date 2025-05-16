import api from "./axios";

// 로그인
// request: {username, password}
// response: {message, token}
export const login = async (email, password) => {
    const res = await api.post("/auth/login", { username: email, password });
    return res.data;
};

// 로그아웃은 AuthProvider 참고

// 회원가입
// request: {email, password, name, role!}
// response: message
export const signup = async (user) => {
    const res = await api.post("/auth/register", user);
    return res.data;
};

// 사용자 정보 조회 & 인증 확인
// request: token (interceptor가 자동으로 추가해줌)
// response: {id, email, name, role}
export const checkAuth = async () => {
    const res = await api.get("/member/profile");
    return res.data;
};
