import api from "./axios";

/**
 * @typedef {'PREPARING'|'IN_PROGRESS'|'CANCELLED'|'COMPLETED'} ExamStatus
 */

/**
 * @typedef {Object} EducatorQuestionDTO
 * @property {number} number
 * @property {string} content
 * @property {string} answer
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
 * @property {EducatorQuestionDTO[] | null} questions
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
 * @typedef {Object} ExamUpdateDTO
 * @property {string} title
 * @property {string} description
 * @property {string} start_time
 * @property {string} end_time
 * @property {ExamStatus} status
 */

/**
 * 시험 목록 조회 (강사용)
 * @param {number} courseId
 * @returns {Promise<EducatorExamDTO[]>}
 */
export const getExamListAPI = async (courseId) => {
    const res = await api.get(`/educator/exam`, {
        params: { courseId },
    });
    return res.data;
};

/**
 * 특정 시험 상세 조회 (강사용)
 * @param {number} courseId
 * @param {number} examId
 * @returns {Promise<EducatorExamDTO>}
 */
export const getExamDetailAPI = async (courseId, examId) => {
    const res = await api.get(`/educator/exam/${examId}`, {
        params: { courseId },
    });
    return res.data;
};

/**
 * 시험 생성 (강사용)
 * @param {number} courseId
 * @param {ExamCreateDTO} examData
 * @returns {Promise<EducatorExamDTO>}
 */
export const createExamAPI = async (courseId, examData) => {
    const res = await api.post(`/educator/exam`, examData, {
        params: { courseId },
    });
    return res.data;
};

/**
 * 시험 수정 (강사용)
 * @param {number} courseId
 * @param {number} examId
 * @param {ExamUpdateDTO} examData
 * @returns {Promise<EducatorExamDTO>}
 */
export const modifyExamAPI = async (courseId, examId, examData) => {
    const res = await api.put(`/educator/exam/${examId}`, examData, {
        params: { courseId },
    });
    return res.data;
};

/**
 * 시험 삭제 (강사용)
 * @param {number} courseId
 * @param {number} examId
 * @returns {Promise<void>}
 */
export const deleteExamAPI = async (courseId, examId) => {
    await api.delete(`/educator/exam/${examId}`, {
        params: { courseId },
    });
};

/**
 * 특정 시험의 학생 제출 목록 조회 (강사용)
 * @param {number} courseId
 * @param {number} examId
 * @returns {Promise<StudentExamSubmissionDTO[]>}
 */
export const getStudentExamSubmissionsAPI = async (courseId, examId) => {
    const res = await api.get(`/educator/exam/${examId}/student-submits`, {
        params: { courseId },
    });
    return res.data;
};

/**
 * 서술형 답안 평가 점수 수정 (강사용)
 * @param {number} courseId
 * @param {number} examId
 * @param {number} studentId
 * @param {number} questionId
 * @param {{ score: number, comment?: string }} evaluationData
 * @returns {Promise<void>}
 */
export const updateAnswerEvaluationAPI = async (
    courseId,
    examId,
    studentId,
    questionId,
    evaluationData
) => {
    await api.patch(
        `/educator/exam/${examId}/student-submits/${studentId}/answers/${questionId}`,
        evaluationData,
        { params: { courseId } }
    );
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
 * 학생 시험 시작 API
 * @param {number} courseId
 * @param {number} examId
 * @returns {Promise<void>}
 */
export const startExamAPI = async (courseId, examId) => {
    await api.post(`/student/exam/${courseId}/${examId}/start`);
};

/**
 * 시험 응시 임시 저장
 * @param {number} courseId
 * @param {number} examId
 * @param {{ [questionId: number]: string }} answers
 * @returns {Promise<void>}
 */
export const saveExamDraftAPI = async (courseId, examId, answers) => {
    await api.post(`/student/exam/${courseId}/${examId}/save`, answers);
};

/**
 * 임시 저장한 학생 답안 불러오기
 * @param {number} courseId
 * @param {number} examId
 * @returns {Promise<{ [questionId: number]: string }>}
 */
export const getSavedExamAnswersAPI = async (courseId, examId) => {
    const res = await api.get(`/student/exam/${courseId}/${examId}/answers`);
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
    await api.post(`/student/exam/${courseId}/${examId}/submit`, answers);
};

/**
 * 학생의 개별 시험 성적 조회
 * @param {number} courseId
 * @param {number} examId
 * @returns {Promise<{ score: number, totalScore: number }>} 없으면 404 또는 null 응답
 */
export const getStudentExamScoreAPI = async (courseId, examId) => {
    try {
        const res = await api.get(`/student/exam/${courseId}/${examId}/score`);
        return res.data; // { score, totalScore }
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return null;
        }
        throw err;
    }
};
