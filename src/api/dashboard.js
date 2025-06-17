import api from "./axios";

/**
 * @typedef {Object} CourseDTO
 * @property {number} course_id
 * @property {string} course_name
 * @property {string} educator_name
 */

/**
 * 최근 수강 강의 목록 조회 (학생용)
 * @returns {Promise<CourseDTO[]>}
 */
export const getRecentEnrolledCoursesAPI = async () => {
    const res = await api.get("/main_dashboard/students/recent-enrolled");
    return res.data;
};

/**
 * 최근 완료 강의 목록 조회 (학생용)
 * @returns {Promise<CourseDTO[]>}
 */
export const getRecentCompletedCoursesAPI = async () => {
    const res = await api.get("/main_dashboard/students/recent-completed");
    return res.data;
};

/**
 * 최근 개설 강의 목록 조회 (강사용)
 * @returns {Promise<CourseDTO[]>}
 */
export const getRecentCreatedCoursesAPI = async () => {
    const res = await api.get("/main_dashboard/educators/recent-created");
    return res.data;
};

/**
 * 최근 수정 강의 목록 조회 (강사용)
 * @returns {Promise<CourseDTO[]>}
 */
export const getRecentUpdatedCoursesAPI = async () => {
    const res = await api.get("/main_dashboard/educators/recent-updated");
    return res.data;
};
