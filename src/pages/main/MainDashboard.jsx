import { useState, useEffect, useRef, useCallback } from "react";
import CourseCardGrid from "../../components/dashboard/CourseCardGrid";
import Profile from "../../components/dashboard/Profile";
import ProfileEditModal from "../../components/dashboard/ProfileEditModal";
import useAuth from "../../hooks/auth/useAuth";
import { Box, CircularProgress } from "@mui/material";

// 임시 데이터
const mockRecentCourses = [
    { id: 1, name: "React 기초", educatorName: "이강사" },
    {
        id: 2,
        name: "TypeScript 완전 정복 TypeScript 완전 정복 TypeScript 완전 정복",
        educatorName: "박강사",
    },
    { id: 3, name: "MUI 활용하기", educatorName: "최강사" },
    { id: 4, name: "JavaScript 고급", educatorName: "김강사" },
];

const mockCompletedCourses = [
    { id: 5, name: "HTML/CSS 기본", educatorName: "강강사" },
    { id: 6, name: "Node.js 입문", educatorName: "이강사" },
    { id: 7, name: "Git 실전", educatorName: "박강사" },
    { id: 8, name: "Docker 시작하기", educatorName: "김강사" },
];

// 역할에 따라 텍스트 및 경로 설정
const DASHBOARD_TEXT = {
    STUDENT: {
        recent: "최근 수강 강의",
        completed: "최근 완강 강의",
        moreRecent: "/learn/courses/my/enrolled",
        moreCompleted: "/learn/courses/my/completed",
    },
    EDUCATOR: {
        recent: "최근 등록 강의",
        completed: "최근 수정 강의",
        moreRecent: "/teach/courses/my",
        moreCompleted: "/teach/courses/my",
    },
};

export default function MainDashboard() {
    const { user } = useAuth();

    const [recentCourses, setRecentCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);

    // 프로필 폼 상태
    const initForm = useCallback(
        () => ({
            name: user.name,
            email: user.email,
            description: user.description || "",
        }),
        [user]
    );

    const [form, setForm] = useState(initForm);

    // 모달 상태
    const [modalState, setModalState] = useState({ edit: false });

    const editButtonRef = useRef(null);
    const firstFieldRef = useRef(null);

    useEffect(() => {
        setRecentCourses(mockRecentCourses);
        setCompletedCourses(mockCompletedCourses);
    }, []);

    useEffect(() => {
        setForm(initForm());
    }, [initForm]);

    const handleOpenEditModal = useCallback(() => {
        setForm(initForm());
        setModalState({ edit: true });
    }, [initForm]);

    const handleCloseEditModal = useCallback(() => {
        setModalState({ edit: false });
        setForm(initForm());
        editButtonRef.current?.focus();
    }, [initForm]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSaveEdit = useCallback(async () => {
        try {
            // TODO: 사용자 정보 수정 API 호출
            setModalState({ edit: false });
            alert("프로필이 성공적으로 수정되었습니다.");
            editButtonRef.current?.focus();
        } catch (err) {
            console.error("사용자 정보 수정 실패:", err);
            alert("수정 중 오류가 발생했습니다.");
        }
    }, [form]);

    if (!user || recentCourses.length === 0) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    const roleText = DASHBOARD_TEXT[user.role] ?? DASHBOARD_TEXT.STUDENT;

    return (
        <Box sx={{ p: 4 }}>
            <Profile
                user={user}
                onEditClick={handleOpenEditModal}
                editButtonRef={editButtonRef}
            />

            <CourseCardGrid
                courses={recentCourses}
                title={roleText.recent}
                moreLink={roleText.moreRecent}
            />
            <CourseCardGrid
                courses={completedCourses}
                title={roleText.completed}
                moreLink={roleText.moreCompleted}
            />

            <ProfileEditModal
                openEditModal={modalState.edit}
                onCloseEditModal={handleCloseEditModal}
                onAfterOpen={() => firstFieldRef.current?.focus()}
                onAfterClose={() => editButtonRef.current?.focus()}
                form={form}
                onChange={handleChange}
                onSave={handleSaveEdit}
                firstFieldRef={firstFieldRef}
            />
        </Box>
    );
}
