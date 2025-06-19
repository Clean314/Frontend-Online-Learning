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
 * 특정 강의의 누적 시청 시간 조회
 * @param {number} lectureId - 강의 ID
 * @returns {Promise<number>} - 누적 시청 시간 (초 단위)
 */
export const getWatchedTimeAPI = async (lectureId) => {
    const res = await api.get(`/history/watched-time/${lectureId}`);
    return res.data; // 예: 123.4
};

/**
 * 강의 시청 이력 저장 (타임라인)
 * @param {{ lectureId: number, watchedTime: number, attendance: boolean }} payload
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
 * @typedef {Object} CourseAttendanceDTO
 * @property {string} studentName        - 학생 이름
 * @property {number} totalCourse        - 전체 수강한 강의 수
 * @property {number} attendanceTrue     - 출석한 강의 수
 * @property {number} attendanceFalse    - 결석한 강의 수
 * @property {number} attendanceAvg      - 출석률 (0.0 ~ 100.0)
 * @property {number} memberId           - 학생 회원 ID
 */

/**
 * 특정 강의(courseId)에 대한 전체 학생 출석 리스트 조회
 * @param {number} courseId
 * @returns {Promise<CourseAttendanceDTO[]>}
 */
export const getCourseAttendanceListAPI = async (courseId) => {
    const res = await api.get(`/history/attendance/${courseId}/list`);
    return res.data;
};

/**
 * 특정 강의(courseId)에 대한 전체 평균 출석률 조회
 * @param {number} courseId
 * @returns {Promise<number>} 0.0 ~ 100.0 범위의 평균 출석률
 */
export const getCourseAvgAttendanceAPI = async (courseId) => {
    const res = await api.get(`/history/attendance/${courseId}`);
    return res.data;
};
