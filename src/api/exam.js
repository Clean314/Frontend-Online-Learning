import api from "./axios";

/**
 * @typedef {'PREPARING'|'IN_PROGRESS'|'CANCELLED'|'COMPLETED'} ExamStatus
 */

/**
 * @typedef {'SUBJECTIVE'|'OBJECTIVE'} QuestionType
 * - 확장 가능성을 고려해 주관식, 객관식 분리 BUT 개발 일정 상 객관식만 구현
 */

/**
 * @typedef {Object} EducatorQuestionDTO
 * @property {number} number
 * @property {string} content
 * @property {string} answer
 * @property {number} score
 */

/**
 * @typedef {Object} StudentQuestionDTO
 * @property {number} number
 * @property {string} content
 * @property {number} score
 */

/**
 * @typedef {Object} EducatorExamDTO
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} start_time
 * @property {string} end_time
 * @property {ExamStatus} status
 * @property {number} course_id
 * @property {EducatorQuestionDTO[]} questions
 */

/**
 * @typedef {Object} StudentExamDTO
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} start_time
 * @property {string} end_time
 * @property {ExamStatus} status
 * @property {number} course_id
 * @property {StudentQuestionDTO[]} questions
 */

/**
 * @typedef {Object} ExamCreateDTO
 * @property {string} title
 * @property {string} description
 * @property {string} start_time
 * @property {string} end_time
 * @property {EducatorQuestionDTO[]} questions
 */

/**
 * 강사용 시험 목록 조회
 * @param {number} courseId
 * @returns {Promise<EducatorExamDTO[]>}
 */
export const getExamListAPI = async (courseId) => {
    const res = await api.get(`/educator/exam/${courseId}`);
    return res.data;
};

/**
 * 강사용 특정 시험 조회
 * @param {number} courseId
 * @param {number} examId
 * @returns {Promise<EducatorExamDTO>}
 */
export const getExamDetailAPI = async (courseId, examId) => {
    const res = await api.get(`/educator/exam/${courseId}/${examId}`);
    return res.data;
};

/**
 * 시험 생성 (강사용)
 * @param {number} courseId
 * @param {ExamCreateDTO} examData
 * @returns {Promise<number>} 생성된 시험 ID
 */
export const createExamAPI = async (courseId, examData) => {
    const res = await api.post(`/educator/exam/${courseId}`, examData);
    return res.data;
};

/**
 * 시험 수정 (강사용)
 * @param {number} courseId
 * @param {number} examId
 * @param {Partial<ExamCreateDTO>} examData
 * @returns {Promise<number>} 수정된 시험 ID
 */
export const modifyExamAPI = async (courseId, examId, examData) => {
    const res = await api.put(`/educator/exam/${courseId}/${examId}`, examData);
    return res.data;
};

/**
 * 시험 삭제 (강사용)
 * @param {number} courseId
 * @param {number} examId
 * @returns {Promise<void>}
 */
export const deleteExamAPI = async (courseId, examId) => {
    await api.delete(`/educator/exam/${courseId}/${examId}`);
};

/**
 * 학생용 시험 목록 조회
 * @param {number} courseId
 * @returns {Promise<StudentExamDTO[]>}
 */
export const getStudentExamListAPI = async (courseId) => {
    const res = await api.get(`/student/exam/${courseId}`);
    return res.data;
};

/**
 * 학생용 특정 시험 조회
 * @param {number} courseId
 * @param {number} examId
 * @returns {Promise<StudentExamDTO>}
 */
export const getStudentExamDetailAPI = async (courseId, examId) => {
    const res = await api.get(`/student/exam/${courseId}/${examId}`);
    return res.data;
};

/**
 * 학생용 시험 제출
 * @param {number} courseId
 * @param {number} examId
 * @param {Object} answers
 * @returns {Promise<void>}
 */
export const submitStudentExamAPI = async (courseId, examId, answers) => {
    await api.post(`/student/exam/${courseId}/${examId}`, answers);
};
