import api from "./axios";

/**
 * @typedef {Object} CourseDTO
 * @property {number} id
 * @property {string} course_name
 * @property {string} category
 * @property {string} difficulty
 * @property {number} point
 * @property {string} description
 * @property {number} max_enrollment
 * @property {number} available_enrollment
 */

/**
 * @typedef {Object} CourseCreateDTO
 * @property {string} course_name
 * @property {string} category
 * @property {string} difficulty
 * @property {number} point
 * @property {string} description
 * @property {number} max_enrollment
 */

/**
 * 전체 강의 목록 조회 (강사용)
 * @returns {Promise<Array<CourseDTO>>} - 모든 강의 정보 리스트 반환
 */
export const getAllCoursesAPI = async () => {
    const res = await api.get("/educators/courses");
    return res.data;
};

/**
 * 내 개설 강의 목록 조회 (강사용)
 * @returns {Promise<Array<CourseDTO>>} - 본인이 개설한 강의 정보 리스트 반환
 */
export const getMyRegisteredCoursesAPI = async () => {
    const res = await api.get("/educators/courses/my");
    return res.data;
};

/**
 * 특정 강의 상세 조회 (강사용)
 * @param {number} courseId - 조회할 강의 ID
 * @returns {Promise<CourseDTO>} - 해당 강의의 상세 정보 반환
 */
export const getCourseInfoAPI = async (courseId) => {
    const res = await api.get(`/educators/courses/course-id/${courseId}`);
    return res.data;
};

/**
 * 강의 생성 (강사용)
 * @param {CourseCreateDTO} courseData - 생성할 강의 데이터 객체
 * @returns {Promise<number>} - 생성된 강의 ID 반환
 */
export const createCourseAPI = async (courseData) => {
    const res = await api.post("/educators/courses", courseData);
    return res.data;
};

/**
 * 강의 정보 수정 (강사용)
 * @param {number} courseId - 수정할 강의 ID
 * @param {CourseCreateDTO} courseData - 수정할 강의 데이터 객체
 * @returns {Promise<void>}
 */
export const modifyCourseInfoAPI = async (courseId, courseData) => {
    await api.patch(`/educators/courses/course-id/${courseId}`, courseData);
};

/**
 * 강의 삭제 (강사용)
 * @param {number} courseId - 삭제할 강의 ID
 * @returns {Promise<number>} - 수정된 강의 ID
 */
export const deleteCourseAPI = async (courseId) => {
    const res = await api.delete(`/educators/courses/course-id/${courseId}`);
    return res.data;
};
