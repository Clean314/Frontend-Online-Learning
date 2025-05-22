import api from "./axios";

// 전체 강의 목록 조회
export const getAllCoursesAPI = async () => {
    const res = await api.get("/educators/courses");
    return res.data;
};

// 내 개설 강의 목록 조회 (강사 전용)
export const getMyRegisteredCoursesAPI = async () => {
    const res = await api.get("/educators/courses/my");
    return res.data;
};

// 강의 생성
// { name, maxEnrollment, point, category, difficulty, description }
export const createCourseAPI = async (courseData) => {
    await api.post("/educators/courses", courseData);
};
