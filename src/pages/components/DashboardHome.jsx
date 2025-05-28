import React, { useState, useEffect } from "react";
import {
    Box,
    Avatar,
    Typography,
    CircularProgress,
    TextField,
    Stack,
    IconButton,
    Button,
    Drawer,
} from "@mui/material";
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
} from "@mui/icons-material";
import CourseCardGrid from "./shared/CourseCardGrid";
import useAuth from "../../hooks/auth/useAuth";

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

export default function DashboardHome() {
    const { user } = useAuth();

    const [recentCourses, setRecentCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", description: "" });
    const [openDeleteCurtain, setOpenDeleteCurtain] = useState(false);

    const initForm = () => ({
        name: user.name,
        email: user.email,
        description: user.description || "",
    });

    useEffect(() => {
        setRecentCourses(mockRecentCourses);
        setCompletedCourses(mockCompletedCourses);
        setForm(initForm());
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const startEdit = () => setIsEditing(true);
    const cancelEdit = () => {
        setForm(initForm());
        setIsEditing(false);
    };
    const saveEdit = async () => {
        // TODO: 사용자 정보 수정 API
        setIsEditing(false);
    };

    const openDelete = () => setOpenDeleteCurtain(true);
    const closeDelete = () => setOpenDeleteCurtain(false);
    const confirmDelete = async () => {
        // TODO: 회원 탈퇴 API
        setOpenDeleteCurtain(false);
    };

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
            {/* 사용자 정보 */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 6,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
                        {user.name.charAt(0)}
                    </Avatar>
                    <Box>
                        {isEditing ? (
                            <>
                                <TextField
                                    label="이름"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    variant="standard"
                                    fullWidth
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="이메일"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    variant="standard"
                                    fullWidth
                                    disabled
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="소개"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    variant="standard"
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                            </>
                        ) : (
                            <>
                                <Typography variant="h5" gutterBottom>
                                    {user.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {user.email}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>
                                    {user.description ||
                                        `안녕하세요. ${user.name}의 대시보드입니다.`}
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>

                <Stack direction="row" spacing={1}>
                    {isEditing ? (
                        <>
                            <IconButton
                                color="primary"
                                onClick={saveEdit}
                                size="large"
                            >
                                <SaveIcon />
                            </IconButton>
                            <IconButton onClick={cancelEdit} size="large">
                                <CancelIcon />
                            </IconButton>
                        </>
                    ) : (
                        <IconButton onClick={startEdit} size="large">
                            <EditIcon />
                        </IconButton>
                    )}
                </Stack>
            </Box>

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
            <Box sx={{ mt: 6, textAlign: "center" }}>
                <Button color="error" variant="outlined" onClick={openDelete}>
                    회원 탈퇴
                </Button>
            </Box>

            {/* 탈퇴 확인 커튼 */}
            <Drawer
                anchor="bottom"
                open={openDeleteCurtain}
                onClose={closeDelete}
                ModalProps={{ keepMounted: true }}
            >
                <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="h6" gutterBottom>
                        정말 탈퇴하시겠습니까?
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        탈퇴하시면 계정과 모든 데이터가 삭제됩니다.
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button onClick={closeDelete}>취소</Button>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={confirmDelete}
                        >
                            탈퇴하기
                        </Button>
                    </Stack>
                </Box>
            </Drawer>
        </Box>
    );
}
