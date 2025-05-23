import api from "./axios";

// 수강 신청
// request: { courseId: number }
export const enrollCourseAPI = async (courseId) => {
    await api.post(`/students/enrollments/${courseId}`);
};

// 수강 취소
// request: { courseId: number }
export const cancelEnrollmentAPI = async (courseId) => {
    await api.delete(`/students/enrollments/${courseId}`);
};

// 내 수강목록 조회
// {course_id, course_name, educator_name, category, difficulty, status, max_enrollment, available_enrollment, point}
// status : ENROLLED, COMPLETED, WITHDRAWN, AVAILABLE
export const getMyEnrollmentsAPI = async () => {
    const res = await api.get("/students/enrollments/my");
    return res.data;
};

// 전체 강의 목록 조회 (학생용 - status 있음)
export const getAllCoursesWithStatusAPI = async () => {
    const res = await api.get("/students/enrollments");
    return res.data;
};
