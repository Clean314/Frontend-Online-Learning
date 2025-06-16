import api from "./axios";

/**
 * @typedef {'SUBJECTIVE'|'OBJECTIVE'} QuestionType
 * - 확장 가능성을 고려해 주관식, 객관식 분리 BUT 개발 일정 상 객관식만 구현
 */

/**
 * @typedef {Object} QuestionForm
 * @property {number} number
 * @property {string} content
 * @property {string} answer
 * @property {number} score
 */

/**
 * 시험 문제 목록 조회
 * @param {number} courseId
 * @param {number} examId
 * @returns {Promise<QuestionForm[]>}
 */
export const getQuestionListAPI = async (courseId, examId) => {
    const res = await api.get("/educator/question", {
        params: { courseId, examId },
    });
    return res.data;
};

/**
 * 시험 문제 생성
 * @param {number} courseId
 * @param {number} examId
 * @param {QuestionForm} question
 * @returns {Promise<Object>}
 */
export const createQuestionAPI = async (courseId, examId, question) => {
    const res = await api.post("/educator/question", question, {
        params: { courseId, examId },
    });
    return res.data;
};

/**
 * 시험 문제 수정
 * @param {number} courseId
 * @param {number} examId
 * @param {number} questionId
 * @param {QuestionForm} question
 * @returns {Promise<Object>}
 */
export const updateQuestionAPI = async (
    courseId,
    examId,
    questionId,
    question
) => {
    const res = await api.put("/educator/question", question, {
        params: { courseId, examId, questionId },
    });
    return res.data;
};

/**
 * 시험 문제 삭제
 * @param {number} courseId
 * @param {number} examId
 * @param {number} questionId
 * @returns {Promise<void>}
 */
export const deleteQuestionAPI = async (courseId, examId, questionId) => {
    await api.delete("/educator/question", {
        params: { courseId, examId, questionId },
    });
};
