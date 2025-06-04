import api from "./axios";

/**
 * 강의별 나의 시험 목록 조회 (강사용)
 * @param {number} courseId - 조회할 강의 ID
 * @returns {Promise<any>} - DTO 형식은 서버 스펙에 따름
 */
export const getMyTestsByCourseAPI = async (courseId) => {
    const res = await api.get(`/learn/test-scores/${courseId}`);
    return res.data;
};
