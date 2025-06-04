import api from "./axios";

/**
 * 강의(동영상) 목록 조회 (강사용)
 * @param {number} courseId - 조회할 강의(course) ID
 * @returns {Promise<Array<LectureDTO>>}
 *   LectureDTO:
 *   {
 *     title: string,            // 동영상 제목
 *     videoUrl: string,         // 동영상 URL
 *     createdAt: string,        // 생성 일시
 *     updatedAt: string,        // 수정 일시
 *     course_id: long,          // 강의 ID
 *   }
 */
export const getLectureListAPI = async (courseId) => {
    const res = await api.get(`/lecture/list/${courseId}`);
    return res.data;
};

/**
 * 강의(동영상) 생성 (강사용)
 * @param {number} courseId - 소속 강의(course) ID
 * @param {Object} lectureData - 생성할 Lecture 정보 객체
 *   lectureData:
 *   {
 *     title: string,      // 동영상 제목 (NotBlank, 최대 길이 제한 있음)
 *     videoUrl: string    // 동영상 URL (NotBlank, URL 형식)
 *   }
 * @returns {Promise<LectureDTO>}
 *   LectureDTO:
 *   {
 *     title: string,            // 동영상 제목
 *     videoUrl: string,         // 동영상 URL
 *     createdAt: string,        // 생성 일시
 *     updatedAt: string,        // 수정 일시
 *     course_id: long,          // 강의 ID
 *   }
 */
export const createLectureAPI = async (courseId, lectureData) => {
    const res = await api.post(`/lecture/${courseId}`, lectureData);
    return res.data;
};
