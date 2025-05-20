import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Avatar,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Button,
    CardActionArea,
} from "@mui/material";

// TODO: 실제 API 연결 후 mock 데이터 제거
const mockUser = {
    id: 1,
    name: "홍길동",
    email: "hong@example.com",
    description: "안녕하세요! 저는 프론트엔드 개발자 홍길동입니다.",
    role: "STUDENT",
};

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

export default function DashboardHome({ editable }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [recentCourses, setRecentCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: API 호출 로직으로 아래 mock 데이터 교체
        setUser(mockUser); // TODO: 사용자 정보 API 연결
        setRecentCourses(mockRecentCourses); // TODO: 최근 수강 중인 강의 API 연결
        setCompletedCourses(mockCompletedCourses); // TODO: 최근 완료한 강의 API 연결
        setLoading(false);
    }, []);

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
                        <Typography variant="h5" component="h1" gutterBottom>
                            {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user.email}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            {user.description}
                        </Typography>
                    </Box>
                </Box>
                {editable && (
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => {
                            /* TODO: 수정 핸들러 */
                        }}
                    >
                        수정
                    </Button>
                )}
            </Box>

            {/* 최근 수강 중인 강의 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    {user.role === "STUDENT"
                        ? "최근 수강한 강의"
                        : "최근 등록한 강의"}
                </Typography>
                <Grid container spacing={2} alignItems="stretch">
                    {recentCourses.map((course) => (
                        <Grid
                            item
                            size={{ xs: 12, sm: 6, md: 2.5 }}
                            key={course.id}
                        >
                            <CardActionArea
                                onClick={() => {
                                    editable
                                        ? navigate(
                                              `/courses/${course.id}/classroom`
                                          )
                                        : navigate(`/courses/${course.id}`);
                                }}
                                sx={{ borderRadius: 2 }}
                            >
                                <Card
                                    sx={{
                                        height: 160,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        p: 2,
                                        borderRadius: 2,
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            flexGrow: 1,
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                display: "-webkit-box",
                                                WebkitBoxOrient: "vertical",
                                                WebkitLineClamp: 3,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                wordBreak: "break-word",
                                                lineHeight: "1.4em",
                                                maxHeight: "4.2em",
                                                textAlign: "left",
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
                                    </CardContent>
                                </Card>
                            </CardActionArea>
                        </Grid>
                    ))}
                    {/* 목록으로 이동 버튼 */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Button
                            fullWidth
                            variant="text"
                            sx={{ height: 160, borderRadius: 2 }}
                            onClick={() => {
                                user.role === "STUDENT"
                                    ? navigate("/learn/myCourses/enrolled")
                                    : navigate("/teach/myCourses/");
                            }}
                        >
                            MORE &gt;
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* 최근 완료한 강의 */}
            <Box>
                <Typography variant="h6" gutterBottom>
                    {user.role === "STUDENT"
                        ? "최근 완료한 강의"
                        : "최근 수정한 강의"}
                </Typography>
                <Grid container spacing={2} alignItems="stretch">
                    {completedCourses.map((course) => (
                        <Grid
                            item
                            size={{ xs: 12, sm: 6, md: 2.5 }}
                            key={course.id}
                        >
                            <CardActionArea
                                onClick={() => {
                                    editable
                                        ? navigate(
                                              `/courses/${course.id}/classroom`
                                          )
                                        : navigate(`/courses/${course.id}`);
                                }}
                                sx={{ borderRadius: 2 }}
                            >
                                <Card
                                    sx={{
                                        height: 160,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        p: 2,
                                        borderRadius: 2,
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            flexGrow: 1,
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                display: "-webkit-box",
                                                WebkitBoxOrient: "vertical",
                                                WebkitLineClamp: 3,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                wordBreak: "break-word",
                                                lineHeight: "1.4em",
                                                maxHeight: "4.2em",
                                                textAlign: "left",
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
                                    </CardContent>
                                </Card>
                            </CardActionArea>
                        </Grid>
                    ))}
                    {/* 목록으로 이동 버튼 */}
                    {editable && (
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="text"
                                sx={{ height: 160, borderRadius: 2 }}
                                onClick={() => {
                                    user.role === "STUDENT"
                                        ? navigate("/learn/myCourses/completed")
                                        : navigate("/teach/myCourses/");
                                }}
                            >
                                MORE &gt;
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Box>
    );
}
