import api from "./axios";

/**
 * @typedef {Object} LectureDTO
 * @property {number} id
 * @property {string} title
 * @property {string} videoUrl
 * @property {string} description
 * @property {string} duration
 */

/**
 * @typedef {Object} LectureHistoryDTO
 * @property {number} id
 * @property {number} videoId
 * @property {number} studentId
 * @property {string} startTime
 * @property {string} endTime
 */

/**
 * 강의 영상 시청 내역 저장
 * @param {number} videoId
 * @param {{ startTime: string, endTime: string }} payload
 * @returns {Promise<LectureHistoryDTO>}
 */
export const createLectureHistoryAPI = async (videoId, payload) => {
    const res = await api.post(`/lecture-histories/${videoId}`, payload);
    return res.data;
};
