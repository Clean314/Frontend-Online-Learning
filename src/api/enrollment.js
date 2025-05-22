import api from "./axios";

// 수강 신청
// POST /learn/enrollment/enroll
// request: { courseId: number }
export const enrollCourseAPI = async (courseId) => {
    await api.post(`/learn/enrollment/${courseId}`);
};

// 수강 취소
// POST /learn/enrollment/cancel
// request: { courseId: number }
export const cancelEnrollmentAPI = async (courseId) => {
    await api.delete(`/learn/enrollment/${courseId}`);
};

// 내 수강목록 조회
// GET /learn/enrollment/my-enrollments
export const getMyEnrollmentsAPI = async () => {
    const res = await api.get("/learn/enrollment");
    return res.data;
};
