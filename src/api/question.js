import api from "./axios";

/**
 * @typedef {'CHOICE'|'TRUE_FALSE'|'SUBJECTIVE'} QuestionType
 */

/**
 * @typedef {Object} QuestionForm
 * @property {number} id        - 문제 ID
 * @property {number} number    - 문제 번호
 * @property {string} content   - 문제 내용
 * @property {string} answer    - 정답
 * @property {number} score     - 배점
 */

/**
 * @typedef {Object} QuestionRequestDTO
 * @property {number} number            - 문제 번호
 * @property {string} content           - 문제 내용
 * @property {string} answer            - 정답
 * @property {number} score             - 배점
 * @property {QuestionType} type        - 문제 유형
 * @property {string[] | null} multipleChoices - 객관식 보기 (주관식/참거짓은 null)
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
 * @property {number} id
 * @property {string} content
 * @property {number} score
 * @property {QuestionType} type
 * @property {string[] | null} multipleChoices
 */

/**
 * 시험 문제 목록 조회 (강사용)
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
 * 시험 문제 생성 (강사용)
 * @param {number} courseId
 * @param {number} examId
 * @param {QuestionRequestDTO} question
 * @returns {Promise<Object>}
 */
export const createQuestionAPI = async (courseId, examId, question) => {
    const res = await api.post("/educator/question", question, {
        params: { courseId, examId },
    });
    return res.data;
};

/**
 * 시험 문제 수정 (강사용)
 * @param {number} courseId
 * @param {number} examId
 * @param {number} questionId
 * @param {QuestionRequestDTO} question
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
 * 시험 문제 삭제 (강사용)
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

/**
 * 시험 문제 목록 조회 (학생용)
 * @param {number} courseId
 * @param {number} examId
 * @returns {Promise<StudentQuestionDTO[]>}
 */
export const getStudentQuestionListAPI = async (courseId, examId) => {
    const res = await api.get("/student/question", {
        params: { courseId, examId },
    });
    return res.data;
};
