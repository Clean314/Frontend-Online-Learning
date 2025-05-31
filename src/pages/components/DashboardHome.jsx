import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Avatar,
    Typography,
    CircularProgress,
    TextField,
    Stack,
    Button,
    Drawer,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
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
    const [openEditModal, setOpenEditModal] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", description: "" });
    const [openDeleteCurtain, setOpenDeleteCurtain] = useState(false);

    // “프로필 수정” 버튼을 가리키는 ref
    const editButtonRef = useRef(null);
    // 첫 포커스가 들어가야 할 모달 내의 첫 번째 필드(ref)
    const firstFieldRef = useRef(null);

    // user가 바뀔 때마다 초기 폼값 세팅
    const initForm = () => ({
        name: user.name,
        email: user.email,
        description: user.description || "",
    });

    useEffect(() => {
        // 임시 강의 데이터 세팅
        setRecentCourses(mockRecentCourses);
        setCompletedCourses(mockCompletedCourses);

        // user 정보로 폼 초기화
        setForm(initForm());
    }, [user]);

    // 모달 열기
    const handleOpenEditModal = () => {
        setForm(initForm());
        setOpenEditModal(true);
    };

    // 모달 닫기
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    };

    // 모달이 완전히 열렸을 때, 포커스 이동
    const handleAfterModalOpen = () => {
        firstFieldRef.current?.focus?.();
    };

    // 모달이 완전히 닫혔을 때, 포커스 이동
    const handleAfterModalClose = () => {
        editButtonRef.current?.focus?.();
    };

    // 입력 필드 변경
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // 저장 버튼 클릭 시 (API 호출 후 모달 닫기)
    const handleSaveEdit = async () => {
        try {
            // TODO: 여기에서 사용자 정보 수정 API 호출
            // await updateUserAPI(form);

            // 성공 시 모달 닫기
            setOpenEditModal(false);
            if (editButtonRef.current) {
                editButtonRef.current.focus();
            }
            alert("프로필이 성공적으로 수정되었습니다.");
        } catch (err) {
            console.error("사용자 정보 수정 실패:", err);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    // 회원 탈퇴 관련
    const openDelete = () => setOpenDeleteCurtain(true);
    const closeDelete = () => setOpenDeleteCurtain(false);
    const confirmDelete = async () => {
        try {
            // TODO: 회원 탈퇴 API 호출
            // await deleteUserAPI();

            setOpenDeleteCurtain(false);
            alert("계정이 삭제되었습니다.");
        } catch (err) {
            console.error("회원 탈퇴 실패:", err);
            alert("탈퇴 중 오류가 발생했습니다.");
        }
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
            {/* 사용자 정보 영역 */}
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
                        <Typography variant="h5" gutterBottom>
                            {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user.email}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            {user.description ||
                                `안녕하세요. ${user.name}님의 대시보드입니다.`}
                        </Typography>
                    </Box>
                </Box>

                <Stack direction="row" spacing={1}>
                    {/* 인라인 편집 대신 일반 버튼으로 변경 */}
                    <Button
                        variant="outlined"
                        onClick={handleOpenEditModal}
                        ref={editButtonRef}
                    >
                        프로필 수정
                    </Button>
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

            {/* 탈퇴 확인 하단 Drawer */}
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

            {/* 프로필 수정 모달 */}
            <Dialog
                open={openEditModal}
                onClose={handleCloseEditModal}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    transition: {
                        onEntered: handleAfterModalOpen,
                        onExited: handleAfterModalClose,
                    },
                }}
            >
                <DialogTitle>프로필 수정</DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mt: 1,
                        }}
                    >
                        {/* 이름 */}
                        <TextField
                            label="이름"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            fullWidth
                            required
                            inputRef={firstFieldRef}
                        />

                        {/* 이메일(수정 불가) */}
                        <TextField
                            label="이메일"
                            name="email"
                            value={form.email}
                            variant="outlined"
                            fullWidth
                            disabled
                        />

                        {/* 소개 */}
                        <TextField
                            label="소개"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseEditModal}>취소</Button>
                    <Button variant="contained" onClick={handleSaveEdit}>
                        저장
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
