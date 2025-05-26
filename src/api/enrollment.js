import api from "./axios";

/**
 * 전체 강의 목록 조회 (수강 상태 포함)
 * @returns {Promise<EnrollmentCourseDTO[]>}
 */
export const getAllCoursesWithStatusAPI = async () => {
    const res = await api.get("/students/enrollments");
    return res.data;
};

/**
 * 내 수강 목록 조회
 * @returns {Promise<EnrollmentCourseDTO[]>}
 */
export const getMyEnrollmentsAPI = async () => {
    const res = await api.get("/students/enrollments/my");
    return res.data;
};

/**
 * 수강 신청
 * @param {number} courseId - 신청할 강의 ID
 * @returns {Promise<void>}
 */
export const enrollCourseAPI = async (courseId) => {
    await api.post(`/students/enrollments/${courseId}`);
};

/**
 * 수강 취소
 * @param {number} courseId - 취소할 강의 ID
 * @returns {Promise<void>}
 */
export const cancelEnrollmentAPI = async (courseId) => {
    await api.delete(`/students/enrollments/${courseId}`);
};
