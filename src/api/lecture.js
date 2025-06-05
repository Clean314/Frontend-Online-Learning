import api from "./axios";

/**
 * LectureDTO 구조 (백엔드와 동일)
 * {
 *   lecture_id: number,    // 동영상 ID
 *   title: string,         // 동영상 제목
 *   video_url: string,      // 동영상 URL
 *   createdAt: string,     // 생성 일시 (ISO 문자열)
 *   updatedAt: string,     // 수정 일시 (ISO 문자열)
 *   course_id: number,     // 소속 강의 ID
 * }
 */

/**
 * 강의(동영상) 목록 조회 (강사용)
 * @param {number} courseId - 조회할 강의(course) ID
 * @returns {Promise<Array<LectureDTO>>}
 */
export const getLectureListAPI = async (courseId) => {
    const res = await api.get(`/lecture/list/${courseId}`);
    return res.data;
};

/**
 * 강의(동영상) 생성 (강사용)
 * @param {number} courseId - 소속 강의(course) ID
 * @param {Array<Object>} lecturesData - 생성할 Lecture 정보 객체 배열
 *   lecturesData = [
 *     {
 *       title: string,      // 동영상 제목 (NotBlank, 최대 길이 제한 있음)
 *       video_url: string    // 동영상 URL (NotBlank, URL 형식)
 *     },
 *     // ...여러 개 동시 등록 가능
 *   ]
 * @returns {Promise<string>} - 생성 완료 메시지 ("강의등록완료" 또는 에러 메시지)
 */
export const createLectureAPI = async (courseId, lecturesData) => {
    const res = await api.post(`/lecture/create/url/${courseId}`, lecturesData);
    return res.data;
};

/**
 * 강의(동영상) 수정 (강사용)
 * @param {number} courseId - 소속 강의(course) ID
 * @param {Array<Object>} lecturesData - 수정할 Lecture 정보 객체 배열
 *   lecturesData = [
 *   {
 *     lecture_id: number,  // 수정할 동영상 ID
 *     title: string,      // 수정할 동영상 제목
 *     video_url: string    // 수정할 동영상 URL
 *   },
 *   // ...
 * ]
 * @returns {Promise<string>} - 업데이트 성공 메시지 ("업데이트 성공")
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
 * @param {number} courseId - 소속 강의(course) ID
 * @param {number} lectureId - 삭제할 동영상 ID
 * @returns {Promise<string>} - 삭제 완료 메시지 ("삭제 완료")
 */
export const deleteLectureAPI = async (courseId, lectureId) => {
    const res = await api.delete(`/lecture/list/${courseId}/${lectureId}`);
    return res.data;
};

/**
 * 강의(동영상) 목록 조회 (학생용)
 * @param {number} courseId - 조회할 강의(course) ID
 * @returns {Promise<LectureDTO[]>} - LectureDTO 객체 배열
 */
export const getStudentLectureListAPI = async (courseId) => {
    const res = await api.get(`/student/lecture/list/${courseId}`);
    return res.data;
};

/**
 * 강의(동영상) 상세 조회 (학생용)
 * @param {number} courseId  - 소속 강의(course) ID
 * @param {number} lectureId - 조회하려는 동영상 ID
 * @returns {Promise<LectureDTO>} - LectureDTO 단일 객체
 */
export const viewLectureAPI = async (courseId, lectureId) => {
    const res = await api.get(`/student/lecture/view/${courseId}/${lectureId}`);
    return res.data;
};
