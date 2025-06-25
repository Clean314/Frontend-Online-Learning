import api from "./axios";

/**
 * @typedef {Object} LoginResponseDTO
 * @property {string} accessToken - 로그인 후 발급된 토큰
 */

/**
 * @typedef {Object} MemberDTO
 * @property {number} id - 사용자 ID
 * @property {string} name - 사용자 이름
 * @property {string} email - 사용자 이메일
 * @property {string} role - 사용자 역할 (예: STUDENT, EDUCATOR, ADMIN)
 * @property {string} description - 사용자 소개
 */

/**
 * @typedef {Object} RegisterRequestDTO
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {'USER'|'ADMIN'|'STUDENT'|'EDUCATOR'} role
 * @property {string} [description]
 */

/**
 * @typedef {Object} MemberUpdateDTO
 * @property {string} name
 * @property {string} description
 */

/**
 * 로그인
 * @param {string} username - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<LoginResponseDTO>}
 */
export const loginAPI = async (email, password) => {
    const res = await api.post("/auth/login", { username: email, password });

    // response 헤더에서 토큰 정보 꺼내기
    const header = res.headers["authorization"] || res.headers["Authorization"];
    // header === "Bearer eyJ...."
    const token = header.split(" ")[1];
    return token;
};

/**
 * 회원가입
 * @param {RegisterRequestDTO} user - 회원가입 정보
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

/**
 * 사용자 정보 수정
 * @param {number} memberId - 수정할 사용자 ID
 * @param {MemberUpdateDTO} memberData - 사용자 정보
 * @returns {Promise<void>}
 */
export const updateMemberInfoAPI = async (memberId, memberData) => {
    await api.put(`/member/${memberId}`, memberData);
};
