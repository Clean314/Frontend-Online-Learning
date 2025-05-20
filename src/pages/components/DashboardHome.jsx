import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Avatar,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Button,
    CardActionArea,
} from "@mui/material";
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

export default function DashboardHome({ editable }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [about, setAbout] = useState(null);
    const [recentCourses, setRecentCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: API 호출 로직으로 아래 mock 데이터 교체
        if (user) {
            setAbout(user);
        }
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
                        {about.name.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" component="h1" gutterBottom>
                            {about.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {about.email}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            {/* {about.description} */}
                            안녕하세요! 저는 프론트엔드 개발자 {user.name}
                            입니다.
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
                    {about.role === "STUDENT"
                        ? "최근 수강한 강의"
                        : "최근 등록한 강의"}
                </Typography>
                <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: editable
                                ? // 강의 개수만큼 1fr, 마지막 MORE만 0.5fr
                                  `repeat(${completedCourses.length}, 1fr) 0.5fr`
                                : `repeat(${completedCourses.length}, 1fr)`,
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
                                    navigate(
                                        editable
                                            ? `/courses/${course.id}/classroom`
                                            : `/courses/${course.id}`
                                    )
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
                    {editable && (
                        <CardActionArea
                            onClick={() =>
                                navigate(
                                    about.role === "STUDENT"
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
                    )}
                </Box>
            </Box>

            {/* 최근 완료한 강의 */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    {about.role === "STUDENT"
                        ? "최근 완료한 강의"
                        : "최근 수정한 강의"}
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: editable
                                ? // 강의 개수만큼 1fr, 마지막 MORE만 0.5fr
                                  `repeat(${completedCourses.length}, 1fr) 0.5fr`
                                : `repeat(${completedCourses.length}, 1fr)`,
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
                                    navigate(
                                        editable
                                            ? `/courses/${course.id}/classroom`
                                            : `/courses/${course.id}`
                                    )
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

                    {editable && (
                        <CardActionArea
                            onClick={() =>
                                navigate(
                                    about.role === "STUDENT"
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
                    )}
                </Box>
            </Box>
        </Box>
    );
}
