import api from "./axios";

/**
 * @typedef {Object} CourseAttendanceDTO
 * @property {string} studentName         - 학생 이름
 * @property {number} totalCourse         - 전체 강의 수
 * @property {number} attendanceTrue      - 출석 인정된 수
 * @property {number} attendanceFalse     - 출석 불인정 수
 * @property {number} attendanceAvg       - 출석률 (0.0 ~ 1.0)
 */

/**
 * @typedef {Object} LectureHistoryDTO
 * @property {number} videoId             - 영상 ID
 * @property {string} startTime           - 시청 시작 시간 (ISO 문자열)
 * @property {string} endTime             - 시청 종료 시간 (ISO 문자열)
 */

/**
 * 강의 영상 시청 기록 저장 (타임라인)
 * @param {{ videoId: number, startTime: string, endTime: string }} payload
 * @returns {Promise<string>} - 성공 메시지
 */
export const saveLectureTimelineAPI = async (payload) => {
    const res = await api.post(`/history/time-line`, payload);
    return res.data;
};

/**
 * 강의 평균 출석률 요청 (학생용)
 * @param {number} courseId
 * @returns {Promise<string>} - 예: "평균 산출완료"
 */
export const fetchAverageAttendanceAPI = async (courseId) => {
    const res = await api.get(`/history/attendance-avg/${courseId}`);
    return res.data;
};

/**
 * 강의별 전체 학생 출석 정보 조회 (강사용)
 * @param {number} courseId
 * @returns {Promise<CourseAttendanceDTO[]>}
 */
export const getStudentAttendanceAPI = async (courseId) => {
    const res = await api.get(`/history/attendance/${courseId}`);
    return res.data;
};
