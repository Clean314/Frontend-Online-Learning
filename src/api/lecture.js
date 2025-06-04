import api from "./axios";

/**
 * 강의(동영상) 목록 조회 (강사용)
 * @param {number} courseId - 조회할 강의(course) ID
 * @returns {Promise<Array<LectureDTO>>}
 *   LectureDTO 구조:
 *   {
 *     lecture_id: number,    // 동영상 ID
 *     title: string,        // 동영상 제목
 *     videoUrl: string,     // 동영상 URL
 *     createdAt: string,    // 생성 일시 (ISO 문자열)
 *     updatedAt: string,    // 수정 일시 (ISO 문자열)
 *     course_id: number,    // 소속 강의 ID
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
 * @returns {Promise<string>} - 생성 완료 메시지 ("강의등록완료")
 */
export const createLectureAPI = async (courseId, lectureData) => {
    // LectureController.java의 @PostMapping("/create/url/{id}") 에 맞추어 경로 수정
    const res = await api.post(`/lecture/create/url/${courseId}`, lectureData);
    return res.data;
};

/**
 * 강의(동영상) 수정 (강사용)
 * @param {number} courseId - 소속 강의(course) ID
 * @param {Array<Object>} lecturesData - 수정할 Lecture 정보 객체 리스트
 *   lecturesData 배열의 각 요소:
 *   {
 *     lecture_id: number,  // 수정할 동영상 ID
 *     title: string,      // 수정할 동영상 제목
 *     videoUrl: string    // 수정할 동영상 URL
 *   }
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
