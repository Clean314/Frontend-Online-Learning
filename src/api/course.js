import api from "./axios";

/**
 * 전체 강의 조회
 * @returns {Promise<CourseDTO[]>}
 */
export const getAllCoursesAPI = async () => {
    const res = await api.get("/educators/courses");
    return res.data;
};

/**
 * 내 개설 강의 조회
 * @returns {Promise<CourseDTO[]>}
 */
export const getMyRegisteredCoursesAPI = async () => {
    const res = await api.get("/educators/courses/my");
    return res.data;
};

/**
 * 강의 생성
 * @param {Object} courseData - 강의 정보
 * @param {string} courseData.courseName
 * @param {string} courseData.category
 * @param {'EASY'|'MEDIUM'|'HARD'} courseData.difficulty
 * @param {number} courseData.point
 * @param {string} [courseData.description]
 * @param {number} courseData.maxEnrollment
 * @param {number} [courseData.availableEnrollment]
 * @returns {Promise<number>}
 */
export const createCourseAPI = async (courseData) => {
    await api.post("/educators/courses", courseData);
};
