import api from "./axios";

/**
 * 로그인
 * @param {string} username - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<LoginResponseDTO>}
 */
export const loginAPI = async (email, password) => {
    const res = await api.post("/auth/login", { username: email, password });

    // 수정) response 헤더에서 토큰 정보 꺼내기
    const header = res.headers["authorization"] || res.headers["Authorization"];
    // header === "Bearer eyJ...."
    const token = header.split(" ")[1];
    return token;
};

/**
 * 회원가입
 * @param {Object} userData - 회원가입 정보
 * @param {string} userData.name
 * @param {string} userData.email
 * @param {string} userData.password
 * @param {'USER'|'ADMIN'|'STUDENT'|'EDUCATOR'} userData.role
 * @param {string} [userData.description]
 * @returns {Promise<string>}
 */
export const signupAPI = async (user) => {
    const res = await api.post("/auth/register", user);
    return res.data;
};

/**
 * 내 프로필 조회
 * @returns {Promise<MemberDTO>}
 */
export const checkAuthAPI = async () => {
    const res = await api.get("/member/profile");
    return res.data;
};
