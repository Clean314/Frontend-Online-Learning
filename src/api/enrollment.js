import api from "./axios";

/**
 * @typedef {Object} EnrollmentCourseDTO
 * @property {number} course_id
 * @property {string} course_name
 * @property {string} educator_name
 * @property {string} category
 * @property {string} difficulty
 * @property {string} status
 * @property {number} point
 * @property {number} max_enrollment
 * @property {number} available_enrollment
 */

/**
 * @typedef {Object} CourseDTO
 * @property {number} course_id
 * @property {string} course_name
 * @property {string} educator_name
 * @property {string} category
 * @property {string} difficulty
 * @property {number} point
 * @property {string} description
 * @property {number} max_enrollment
 * @property {number} available_enrollment
 */

/**
 * 전체 강의 목록 조회 (본인의 수강 상태 포함, 학생용)
 * @returns {Promise<Array<EnrollmentCourseDTO>>} - 모든 강의 정보와 현재 신청 상태 반환
 */
export const getAllCoursesWithStatusAPI = async () => {
    const res = await api.get("/students/enrollments");
    return res.data;
};

/**
 * 특정 수강 강의 상세 조회 (내가 수강 중인 강의 중 하나)
 * @param {number} courseId
 * @returns {Promise<CourseDTO>}
 */
export const getMyEnrolledCourseByIdAPI = async (courseId) => {
    const res = await api.get(`/students/enrollments/course-id/${courseId}`);
    return res.data;
};

/**
 * 내 수강 목록 조회 (학생용)
 * @returns {Promise<Array<EnrollmentCourseDTO>>} - 본인이 신청한 강의 정보 리스트 반환
 */
export const getMyEnrollmentsAPI = async () => {
    const res = await api.get("/students/enrollments/my");
    return res.data;
};

/**
 * 수강 신청 (학생용)
 * @param {number} courseId - 신청할 강의 ID
 * @returns {Promise<void>}
 */
export const enrollCourseAPI = async (courseId) => {
    await api.post(`/students/enrollments/course-id/${courseId}`);
};

/**
 * 수강 취소 (학생용)
 * @param {number} courseId - 취소할 강의 ID
 * @returns {Promise<void>}
 */
export const cancelEnrollmentAPI = async (courseId) => {
    await api.delete(`/students/enrollments/course-id/${courseId}`);
};
