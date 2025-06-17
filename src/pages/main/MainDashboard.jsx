import { useState, useEffect, useRef, useCallback } from "react";
import CourseCardGrid from "../../components/dashboard/CourseCardGrid";
import Profile from "../../components/dashboard/Profile";
import ProfileEditModal from "../../components/dashboard/ProfileEditModal";
import useAuth from "../../hooks/auth/useAuth";
import { Box, CircularProgress } from "@mui/material";
import {
    getRecentCompletedCoursesAPI,
    getRecentCreatedCoursesAPI,
    getRecentEnrolledCoursesAPI,
    getRecentUpdatedCoursesAPI,
} from "../../api/dashboard";
import { checkAuthAPI, updateMemberInfoAPI } from "../../api/auth";
import { useNavigate } from "react-router-dom";

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
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [recentCourses, setRecentCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);

    const [loading, setLoading] = useState(true);

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
    const [modalState, setModalState] = useState({ edit: false }); // 모달 상태

    const editButtonRef = useRef(null);
    const firstFieldRef = useRef(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                if (user.role === "STUDENT") {
                    const [recent, completed] = await Promise.all([
                        getRecentEnrolledCoursesAPI(),
                        getRecentCompletedCoursesAPI(),
                    ]);
                    setRecentCourses(recent);
                    setCompletedCourses(completed);
                } else if (user.role === "EDUCATOR") {
                    const [recent, completed] = await Promise.all([
                        getRecentCreatedCoursesAPI(),
                        getRecentUpdatedCoursesAPI(),
                    ]);
                    setRecentCourses(recent);
                    setCompletedCourses(completed);
                }
            } catch (err) {
                if (err.response?.status === 401) {
                    alert("로그인이 필요합니다. 다시 로그인해주세요.");
                    navigate("/login");
                } else if (err.response?.status === 403) {
                    alert("접근 권한이 없습니다.");
                    navigate("/");
                } else {
                    console.error("대시보드 데이터 조회 실패:", err);
                    alert("데이터를 불러오는 중 오류가 발생했습니다.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchCourses();
        }
    }, [user]);

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
            await updateMemberInfoAPI(user.id, {
                name: form.name,
                description: form.description,
            });

            const updatedUser = await checkAuthAPI();
            setUser(updatedUser);

            setModalState({ edit: false });
            alert("프로필이 성공적으로 수정되었습니다.");
            editButtonRef.current?.focus();
        } catch (err) {
            console.error("사용자 정보 수정 실패:", err);
            alert("수정 중 오류가 발생했습니다.");
        }
    }, [form, user.id]);

    if (!user || loading) {
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
