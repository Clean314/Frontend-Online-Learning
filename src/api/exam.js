import api from "./axios";

/**
 * @typedef {Object} ExamDTO
 * @property {number} id              - 시험 고유 ID
 * @property {string} title           - 시험 제목
 * @property {string} description     - 시험 설명
 * @property {string} startTime       - 시험 시작 시간 (ISO 8601 포맷)
 * @property {string} endTime         - 시험 종료 시간 (ISO 8601 포맷)
 * @property {'PREPARING'|'IN_PROGRESS'|'CANCELLED'|'COMPLETED'} status
 *                                      - 시험 상태
 * @property {number} courseId        - 연관된 강의 ID
 * @property {Array<{id: number, content: string, score: number}>} questions
 *                                      - 시험 문제 목록
 */

/**
 * 강의별 시험 목록 조회 (강사용)
 * @param {number} courseId - 조회할 강의 ID
 * @returns {Promise<Array<ExamDTO>>}
 */
export const getExamListAPI = async (courseId) => {
    const res = await api.get(`/educator/exam/${courseId}`);
    return res.data;
};

/**
 * 특정 시험 조회 (강사용)
 * @param {number} courseId - 조회할 강의 ID
 * @param {number} examId   - 조회할 시험 ID
 * @returns {Promise<ExamDTO>}
 */
export const getExamAPI = async (courseId, examId) => {
    const res = await api.get(`/educator/exam/${courseId}/${examId}`);
    return res.data;
};

/**
 * 시험 생성 (강사용)
 * @param {number} courseId - 강의 ID
 * @param {Object} examData - 생성할 시험 정보 객체
 *  {
 *      title: string,
 *      description?: string,
 *      start_time: string,     // ISO 8601 포맷
 *      end_time: string,       // ISO 8601 포맷
 *  }
 * @returns {Promise<ExamDTO>}
 */
export const createExamAPI = async (courseId, examData) => {
    const res = await api.post(`/educator/exam/${courseId}`, examData);
    return res.data;
};

/**
 * 시험 수정 (강사용)
 * @param {number} courseId - 강의 ID
 * @param {number} examId   - 수정할 시험 ID
 * @param {Object} examData - 수정할 시험 정보 객체
 *  {
 *      title: string,
 *      description?: string,
 *      start_time: string,     // ISO 8601 포맷
 *      end_time: string,       // ISO 8601 포맷
 *      status: {'PREPARING'|'IN_PROGRESS'|'CANCELLED'|'COMPLETED'}
 *  }
 * @returns {Promise<ExamDTO>}
 */
export const updateExamAPI = async (courseId, examId, examData) => {
    const res = await api.put(`/educator/exam/${courseId}/${examId}`, examData);
    return res.data;
};

/**
 * 강의별 시험 목록 조회 (학생용)
 * @param {number} courseId - 조회할 강의 ID
 * @returns {Promise<Array<ExamDTO>>}
 */
export const getStudentExamListAPI = async (courseId) => {
    const res = await api.get(`/student/exam/${courseId}`);
    return res.data;
};
