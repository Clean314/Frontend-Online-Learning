import api from "./axios";

// 수강 신청
// POST /learn/enrollment/enroll
// request: { courseId: number }
export const enrollCourseAPI = async (courseId) => {
    await api.post("/learn/enrollment/enroll", { courseId });
};

// 수강 취소
// POST /learn/enrollment/cancel
// request: { courseId: number }
export const cancelEnrollmentAPI = async (courseId) => {
    await api.post("/learn/enrollment/cancel", { courseId });
};

// 내 수강목록 조회
// GET /learn/enrollment/my-enrollments
// response: EnrollmentDTO[]
export const getMyEnrollmentsAPI = async () => {
    const res = await api.get("/learn/enrollment/my-enrollments");
    return res.data;
};
