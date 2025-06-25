import api from "./axios";

/**
 * @typedef {Object} LectureDTO
 * @property {number} lecture_id     - 동영상 ID
 * @property {string} title          - 동영상 제목
 * @property {string} video_url      - 동영상 URL
 * @property {string} createdAt      - 생성 일시 (ISO 문자열)
 * @property {string} updatedAt      - 수정 일시 (ISO 문자열)
 * @property {number} course_id      - 소속 강의 ID
 */

/**
 * 강의(동영상) 목록 조회 (강사용)
 * @param {number} courseId
 * @returns {Promise<LectureDTO[]>}
 */
export const getLectureListAPI = async (courseId) => {
    const res = await api.get(`/lecture/list/${courseId}`);
    return res.data;
};

/**
 * 강의(동영상) 생성 (강사용)
 * @param {number} courseId
 * @param {{ title: string, video_url: string }[]} lecturesData
 * @returns {Promise<string>}
 */
export const createLectureAPI = async (courseId, lecturesData) => {
    const res = await api.post(`/lecture/create/url/${courseId}`, lecturesData);
    return res.data;
};

/**
 * 강의(동영상) 수정 (강사용)
 * @param {number} courseId
 * @param {{ lecture_id: number, title: string, video_url: string }[]} lecturesData
 * @returns {Promise<string>}
 */
export const updateLectureAPI = async (courseId, lecturesData) => {
    const res = await api.patch(
        `/lecture/list/${courseId}/lecture`,
        lecturesData
    );
    return res.data;
};

/**
 * 강의(동영상) 삭제 (강사용)
 * @param {number} courseId
 * @param {number} lectureId
 * @returns {Promise<string>}
 */
export const deleteLectureAPI = async (courseId, lectureId) => {
    const res = await api.delete(`/lecture/list/${courseId}/${lectureId}`);
    return res.data;
};

/**
 * 강의(동영상) 목록 조회 (학생용)
 * @param {number} courseId
 * @returns {Promise<LectureDTO[]>}
 */
export const getStudentLectureListAPI = async (courseId) => {
    const res = await api.get(`/student/lecture/list/${courseId}`);
    return res.data;
};

/**
 * 강의(동영상) 상세 조회 (학생용)
 * @param {number} courseId
 * @param {number} lectureId
 * @returns {Promise<LectureDTO>}
 */
export const viewLectureAPI = async (courseId, lectureId) => {
    const res = await api.get(`/student/lecture/view/${courseId}/${lectureId}`);
    return res.data;
};
