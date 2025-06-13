import api from "./axios";

/**
 * @typedef {Object} AdminCourseDTO
 * @property {number} course_id
 * @property {string} course_name
 * @property {string} category
 */

/**
 * @typedef {Object} AdminCourseDetailDTO
 * @property {number} course_id
 * @property {string} course_name
 * @property {string} educator_name
 * @property {string} category
 * @property {string} difficulty
 * @property {number} point
 * @property {number} max_enrollment
 */

/**
 * @typedef {Object} AdminMemberDTO
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {string} createdAt
 * @property {string} updateAt
 */

/**
 * 대시보드 통계 (최근 가입·등록 10개, 총 회원·강의 수)
 *  @returns {Promise<{
 *      members: Array<AdminMemberDTO>,
 *      courses: Array<AdminCourseDTO>,
 *      totalMember: number,
 *      totalCourses: number
 * }>}
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
    const res = await api.get("/admin/list/member-update");
    return res.data;
};

/**
 * 특정 사용자 정보 수정 (관리자용)
 * @param {number} id            - 수정할 사용자 ID
 * @param {{ name: string, role: string }} memberData - { name: 회원명, role: 역할 }
 * @returns {Promise<void>}
 */
export const updateMemberAPI = async (id, memberData) => {
    await api.patch(`/admin/list/member-update/${id}`, memberData);
};

/**
 * 특정 사용자 삭제 (관리자용)
 * @param {number} id - 삭제할 사용자 ID
 * @returns {Promise<String>} -- API 결과 메시지
 */
export const deleteMemberAPI = async (id) => {
    const res = await api.delete(`/admin/list/member-delete/${id}`);
    return res.data;
};

/**
 * 강의 전체 목록 조회 (관리자용)
 * @returns {Promise<Array<AdminCourseDetailDTO>>}
 */
export const getCourseUpdateListAPI = async () => {
    const res = await api.get("/admin/list/course-update");
    return res.data;
};

/**
 * 특정 강의 정보 수정 (관리자용)
 * @param {number} id                - 수정할 강의 ID
 * @param {AdminCourseDetailDTO} courseData - 수정할 강의 정보 객체
 * @returns {Promise<void>}
 */
export const updateCourseAPI = async (id, courseData) => {
    await api.patch(`/admin/list/course-update/${id}`, courseData);
};

/**
 * 특정 강의 삭제 (관리자용)
 * @param {number} id - 삭제할 강의 ID
 * @returns {Promise<String>} -- API 결과 메시지
 */
export const deleteCourseAPI = async (id) => {
    const res = await api.delete(`/admin/list/course-delete/${id}`);
    return res.data;
};

/**
 * 사용자 검색 (이름으로 조회, 관리자용)
 * @param {string} name - 검색할 사용자 이름 키워드
 * @returns {Promise<Array<AdminMemberDTO>>}
 */
export const findMemberAPI = async (name) => {
    const res = await api.get("/admin/list/find-member", {
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
    const res = await api.get("/admin/list/find-course", {
        params: { courseName },
    });
    return res.data;
};
