import api from "./axios";

/**
 * 대시보드 통계 (최근 가입·등록 10개, 총 회원·강의 수)
 * @returns {Promise<{ members: Array<AdminMemberDTO>, courses: Array<AdminCourseDTO>, totalMember: number, totalCourses: number }>}
 */
export const getAdminDashboardAPI = async () => {
    const res = await api.get("/admin/list");
    return res.data;
};

/**
 * 사용자 전체 목록 조회 (관리자용)
 * @returns {Promise<Array<AdminMemberDTO>>}
 */
export const getMemberUpdateListAPI = async () => {
    const res = await api.get("/admin/list/memberUpdate");
    return res.data;
};

/**
 * 특정 사용자 정보 수정 (관리자용)
 * @param {number} id            - 수정할 사용자 ID
 * @param {{ name: string, role: string }} memberData - { name: 회원명, role: 역할 }
 * @returns {Promise<void>}
 */
export const updateMemberAPI = async (id, memberData) => {
    await api.patch(`/admin/list/memberUpdate/${id}`, memberData);
};

/**
 * 특정 사용자 삭제 (관리자용)
 * @param {number} id - 삭제할 사용자 ID
 * @returns {Promise<void>}
 */
export const deleteMemberAPI = async (id) => {
    await api.delete(`/admin/list/memberDelete/${id}`);
};

/**
 * 강의 전체 목록 조회 (관리자용)
 * @returns {Promise<Array<AdminCourseDetailDTO>>}
 */
export const getCourseUpdateListAPI = async () => {
    const res = await api.get("/admin/list/courseUpdate");
    return res.data;
};

/**
 * 특정 강의 정보 수정 (관리자용)
 * @param {number} id                - 수정할 강의 ID
 * @param {{
 *   courseName: string,
 *   category: string,
 *   difficulty: 'EASY' | 'MEDIUM' | 'HARD',
 *   point: number,
 *   maxEnrollment: number,
 *   availableEnrollment?: number,
 *   description?: string
 * }} courseData - 수정할 강의 정보 객체
 * @returns {Promise<void>}
 */
export const updateCourseAPI = async (id, courseData) => {
    await api.patch(`/admin/list/courseUpdate/${id}`, courseData);
};

/**
 * 특정 강의 삭제 (관리자용)
 * @param {number} id - 삭제할 강의 ID
 * @returns {Promise<void>}
 */
export const deleteCourseAPI = async (id) => {
    await api.delete(`/admin/list/courseDelete/${id}`);
};

/**
 * 사용자 검색 (이름으로 조회, 관리자용)
 * @param {string} name - 검색할 사용자 이름 키워드
 * @returns {Promise<Array<AdminMemberDTO>>}
 */
export const findMemberAPI = async (name) => {
    const res = await api.get("/admin/list/findMember", {
        params: { name },
    });
    return res.data;
};

/**
 * 강의 검색 (강의명으로 조회, 관리자용)
 * @param {string} courseName - 검색할 강의명 키워드
 * @returns {Promise<Array<AdminCourseDetailDTO>>}
 */
export const findCourseAPI = async (courseName) => {
    const res = await api.get("/admin/list/findCourse", {
        params: { courseName },
    });
    return res.data;
};
