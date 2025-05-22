import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Avatar,
    Typography,
    Card,
    CircularProgress,
    CardActionArea,
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
import useAuth from "../../hooks/auth/useAuth";

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

export default function DashboardHome() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [recentCourses, setRecentCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // 수정 모드 토글
    const [isEditing, setIsEditing] = useState(false);

    // 폼 입력값 관리
    const [form, setForm] = useState({
        name: "",
        email: "",
        description: "",
    });

    useEffect(() => {
        // TODO: API 호출 로직으로 아래 mock 데이터 교체
        setRecentCourses(mockRecentCourses); // TODO: 최근 수강 중인 강의 API 연결
        setCompletedCourses(mockCompletedCourses); // TODO: 최근 완료한 강의 API 연결

        // 초기 폼 값 설정
        setForm({
            name: user.name,
            email: user.email,
            description: user.description || "",
        });

        setLoading(false);
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const startEdit = () => setIsEditing(true);

    const cancelEdit = () => {
        setForm({
            name: user.name,
            email: user.email,
            description: user.description || "",
        });
        setIsEditing(false);
    };

    const saveEdit = async () => {
        // TODO: 사용자 정보 수정 API 연결

        setIsEditing(false);
    };

    // 회원 탈퇴 커튼 열고 닫기 상태
    const [openDeleteCurtain, setOpenDeleteCurtain] = useState(false);

    const openDelete = () => setOpenDeleteCurtain(true);
    const closeDelete = () => setOpenDeleteCurtain(false);
    const confirmDelete = async () => {
        // TODO: 회원 탈퇴 API 연결
        // await deleteAccountAPI();
        setOpenDeleteCurtain(false);
        // 로그아웃 처리, 페이지 이동 등 추가 로직
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            {/* 사용자 정보 섹션 */}
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
                                    sx={{ mb: 1 }}
                                    disabled
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

            {/* 최근 수강 중인 강의 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    {user.role === "STUDENT"
                        ? "최근 수강 강의"
                        : "최근 등록 강의"}
                </Typography>
                <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: `repeat(${completedCourses.length}, 1fr) 0.5fr`, // 강의 개수만큼 1fr, 마지막 MORE만 0.5fr
                        },
                    }}
                >
                    {recentCourses.map((course) => (
                        <Card
                            key={course.id}
                            sx={{
                                height: 160,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                borderRadius: 2,
                                overflow: "hidden",
                                bgcolor: (theme) =>
                                    theme.palette.mode === "dark"
                                        ? theme.palette.grey[800]
                                        : theme.palette.grey[50],
                            }}
                        >
                            <CardActionArea
                                onClick={() =>
                                    navigate(`/courses/${course.id}/classroom`)
                                }
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between", // 텍스트를 카드 상단/하단에 배치
                                    p: 3,
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 3,
                                        lineHeight: "1.4em",
                                        maxHeight: "4.2em",
                                    }}
                                >
                                    {course.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ textAlign: "right" }}
                                >
                                    {course.educatorName} →
                                </Typography>
                            </CardActionArea>
                        </Card>
                    ))}

                    {/* MORE 버튼 */}
                    <CardActionArea
                        onClick={() =>
                            navigate(
                                user.role === "STUDENT"
                                    ? "/learn/myCourses/enrolled"
                                    : "/teach/myCourses"
                            )
                        }
                        sx={{
                            height: 160,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography variant="button">MORE &gt;</Typography>
                    </CardActionArea>
                </Box>
            </Box>

            {/* 최근 완료한 강의 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    {user.role === "STUDENT"
                        ? "최근 완강 강의"
                        : "최근 수정 강의"}
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: `repeat(${completedCourses.length}, 1fr) 0.5fr`,
                        },
                    }}
                >
                    {completedCourses.map((course) => (
                        <Card
                            key={course.id}
                            sx={{
                                height: 160,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                borderRadius: 2,
                                overflow: "hidden",
                                bgcolor: (theme) =>
                                    theme.palette.mode === "dark"
                                        ? theme.palette.grey[800]
                                        : theme.palette.grey[50],
                            }}
                        >
                            <CardActionArea
                                onClick={() =>
                                    navigate(`/courses/${course.id}/classroom`)
                                }
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between", // 텍스트를 카드 상단/하단에 배치
                                    p: 3,
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 3,
                                        lineHeight: "1.4em",
                                        maxHeight: "4.2em",
                                    }}
                                >
                                    {course.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ textAlign: "right" }}
                                >
                                    {course.educatorName} →
                                </Typography>
                            </CardActionArea>
                        </Card>
                    ))}

                    <CardActionArea
                        onClick={() =>
                            navigate(
                                user.role === "STUDENT"
                                    ? "/learn/myCourses/completed"
                                    : "/teach/myCourses"
                            )
                        }
                        sx={{
                            height: 160,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography variant="button">MORE &gt;</Typography>
                    </CardActionArea>
                </Box>
            </Box>

            <Box sx={{ mt: 6, textAlign: "center" }}>
                <Button color="error" variant="outlined" onClick={openDelete}>
                    회원 탈퇴
                </Button>
            </Box>

            {/* — 탈퇴 확인용 하단 커튼(드로어) — */}
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
