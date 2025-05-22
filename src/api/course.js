import api from "./axios";

// 내 개설 강의 목록 조회 (강사 전용)
// GET /learn/course
export const getMyRegisteredCoursesAPI = async () => {
    const res = await api.get("/learn/course");
    return res.data;
};

// 강의 생성
// POST /learn/course
// { name, maxEnrollment, point, category, difficulty, description }
export const createCourseAPI = async (courseData) => {
    await api.post("/learn/course", courseData);
};
