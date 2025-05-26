import api from "./axios";

/**
 * 관리자 대시보드 정보 조회
 * @returns {Promise<{members: Array, courses: Array, totalMember: number, totalCourses: number}>}
 */
export const getAdminDashboardAPI = async () => {
    const res = await api.get("/admin/list");
    return res.data;
};

/**
 * 사용자 전체 목록 조회
 * @returns {Promise<Array<AdminMemberDTO>>}
 */
export const getMemberUpdateListAPI = async () => {
    const res = await api.get("/admin/list/memberUpdate");
    return res.data;
};

/**
 * 사용자 정보 수정
 * @param {number} id      - 수정할 사용자 ID
 * @param {Object} memberData - { name: string, role: string }
 * @returns {Promise<void>}
 */
export const updateMemberAPI = async (id, memberData) => {
    await api.patch(`/admin/list/memberUpdate/${id}`, memberData);
};

/**
 * 사용자 삭제
 * @param {number} id - 삭제할 사용자 ID
 * @returns {Promise<void>}
 */
export const deleteMemberAPI = async (id) => {
    await api.delete(`/admin/list/memberDelete/${id}`);
};

/**
 * 강의 전체 목록 조회
 * @returns {Promise<Array<AdminCourseDetailDTO>>}
 */
export const getCourseUpdateListAPI = async () => {
    const res = await api.get("/admin/list/courseUpdate");
    return res.data;
};

/**
 * 강의 정보 수정
 * @param {number} id         - 수정할 강의 ID
 * @param {Object} courseData - {
 *   courseName: string,
 *   category: string,
 *   difficulty: string,
 *   point: number,
 *   maxEnrollment: number,
 *   availableEnrollment?: number,
 *   description?: string
 * }
 * @returns {Promise<void>}
 */
export const updateCourseAPI = async (id, courseData) => {
    await api.patch(`/admin/list/courseUpdate/${id}`, courseData);
};

/**
 * 강의 삭제
 * @param {number} id - 삭제할 강의 ID
 * @returns {Promise<void>}
 */
export const deleteCourseAPI = async (id) => {
    await api.delete(`/admin/list/courseDelete/${id}`);
};

/**
 * 사용자 검색 (이름)
 * @param {string} name - 검색할 사용자 이름
 * @returns {Promise<Array<AdminMemberDTO>>}
 */
export const findMemberAPI = async (name) => {
    const res = await api.get("/admin/list/findMember", {
        params: { name },
    });
    return res.data;
};

/**
 * 강의 검색 (강의명)
 * @param {string} courseName - 검색할 강의명
 * @returns {Promise<Array<AdminCourseDetailDTO>>}
 */
export const findCourseAPI = async (courseName) => {
    const res = await api.get("/admin/list/findCourse", {
        params: { courseName },
    });
    return res.data;
};
