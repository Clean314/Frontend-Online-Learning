import { useState, useEffect, useRef, useCallback } from "react";
import CourseCardGrid from "../../components/dashboard/CourseCardGrid";
import DeleteDrawer from "../../components/dashboard/DeleteDrawer";
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

    const [recentCourses, setRecentCourses] = useState([]); // 최근 강좌
    const [completedCourses, setCompletedCourses] = useState([]); // 완료 강좌

    // 프로필 폼 상태
    const initForm = useCallback(() => {
        return {
            name: user.name,
            email: user.email,
            description: user.description || "",
        };
    }, [user]);

    const [form, setForm] = useState(initForm);

    // 다이얼로그/Drawer 열림 여부 관리
    const [modalState, setModalState] = useState({
        edit: false,
        delete: false,
    });

    const editButtonRef = useRef(null); // "프로필 수정" 버튼 ref
    const firstFieldRef = useRef(null); // 모달 첫 필드 ref

    // 마운트 시 임시 강의 데이터 세팅
    useEffect(() => {
        setRecentCourses(mockRecentCourses);
        setCompletedCourses(mockCompletedCourses);
    }, []);

    // user가 바뀔 때마다 폼 값 초기화
    useEffect(() => {
        setForm(initForm());
    }, [initForm]);

    // 프로필 수정 모달 열기
    const handleOpenEditModal = useCallback(() => {
        setForm(initForm()); // 모달 열 때마다 최신 user 정보로 폼 세팅
        setModalState((prev) => ({ ...prev, edit: true }));
    }, [initForm]);

    // 프로필 수정 모달 닫기
    const handleCloseEditModal = useCallback(() => {
        setModalState((prev) => ({ ...prev, edit: false }));
        setForm(initForm());
        editButtonRef.current?.focus();
    }, [initForm]);

    // 탈퇴 Drawer 열기/닫기
    const handleOpenDelete = useCallback(() => {
        setModalState((prev) => ({ ...prev, delete: true }));
    }, []);
    const handleCloseDelete = useCallback(() => {
        setModalState((prev) => ({ ...prev, delete: false }));
    }, []);

    // 폼 입력값 변경
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }, []);

    // 저장 버튼 클릭 시
    const handleSaveEdit = useCallback(async () => {
        try {
            // TODO: 사용자 정보 수정 API 호출

            setModalState((prev) => ({ ...prev, edit: false }));
            alert("프로필이 성공적으로 수정되었습니다.");
            editButtonRef.current?.focus();
        } catch (err) {
            console.error("사용자 정보 수정 실패:", err);
            alert("수정 중 오류가 발생했습니다.");
        }
    }, [form]);

    // 탈퇴 확인
    const handleConfirmDelete = useCallback(async () => {
        try {
            // TODO: 회원 탈퇴 API 호출

            setModalState((prev) => ({ ...prev, delete: false }));
            alert("계정이 삭제되었습니다.");
        } catch (err) {
            console.error("회원 탈퇴 실패:", err);
            alert("탈퇴 중 오류가 발생했습니다.");
        }
    }, []);

    // 로딩 또는 user 정보가 없으면 스피너만 렌더
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
            {/* 사용자 정보 영역 */}
            <Profile
                user={user}
                onEditClick={handleOpenEditModal}
                editButtonRef={editButtonRef}
            />

            {/* 강의 카드 그리드 */}
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

            {/* 회원 탈퇴 */}
            <DeleteDrawer
                openDeleteCurtain={modalState.delete}
                onOpenDelete={handleOpenDelete}
                onCloseDelete={handleCloseDelete}
                onConfirmDelete={handleConfirmDelete}
            />

            {/* 프로필 수정 모달 */}
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
