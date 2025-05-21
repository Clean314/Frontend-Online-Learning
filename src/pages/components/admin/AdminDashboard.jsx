import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    CircularProgress,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BarChartIcon from "@mui/icons-material/BarChart";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        userCount: 0,
        courseCount: 0,
        avgEnrollmentCapacity: 0,
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentCourses, setRecentCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: 대시보드 통계 API 호출 (/api/admin/dashboard)
        // TODO: 최근 가입 회원 API 호출 (/api/admin/users?recent=true)
        // TODO: 최근 강의 API 호출 (/api/admin/courses?recent=true)
        setTimeout(() => {
            // 더미 데이터 - 실제 API 호출 결과로 대체
            setStats({
                userCount: 124,
                courseCount: 37,
                avgEnrollmentCapacity: 45,
            });
            setRecentUsers([
                {
                    id: 121,
                    name: "김철수",
                    email: "chulsoo@example.com",
                    role: "STUDENT",
                },
                {
                    id: 122,
                    name: "이영희",
                    email: "younghee@example.com",
                    role: "EDUCATOR",
                },
                {
                    id: 123,
                    name: "박민수",
                    email: "minsu@example.com",
                    role: "STUDENT",
                },
                {
                    id: 124,
                    name: "최유리",
                    email: "yuri@example.com",
                    role: "STUDENT",
                },
                {
                    id: 125,
                    name: "홍길동",
                    email: "hong@example.com",
                    role: "ADMIN",
                },
            ]);
            setRecentCourses([
                { id: 33, subjectCode: "SUBJ033", name: "React 심화" },
                { id: 34, subjectCode: "SUBJ034", name: "Spring Boot 입문" },
                { id: 35, subjectCode: "SUBJ035", name: "데이터베이스 설계" },
                { id: 36, subjectCode: "SUBJ036", name: "네트워크 기초" },
                { id: 37, subjectCode: "SUBJ037", name: "AI 개론" },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    if (loading) {
        return (
            <Box p={4} display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    const cards = [
        {
            title: "총 회원 수",
            value: stats.userCount,
            icon: <PeopleIcon fontSize="large" color="primary" />,
        },
        {
            title: "총 강의 수",
            value: stats.courseCount,
            icon: <MenuBookIcon fontSize="large" color="secondary" />,
        },
        {
            title: "평균 최대 수강인원",
            value: stats.avgEnrollmentCapacity,
            icon: <BarChartIcon fontSize="large" color="success" />,
        },
    ];

    return (
        <Box p={3}>
            <Grid container spacing={2}>
                {cards.map((card) => (
                    <Grid item xs={12} sm={4} key={card.title}>
                        <Card elevation={3}>
                            <CardContent>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}
                                >
                                    {card.icon}
                                    <Box>
                                        <Typography
                                            variant="subtitle1"
                                            color="textSecondary"
                                        >
                                            {card.title}
                                        </Typography>
                                        <Typography variant="h4">
                                            {card.value}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box mt={4}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/admin/users")}
                    >
                        회원 관리
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/admin/courses")}
                    >
                        강의 관리
                    </Button>
                </Stack>
            </Box>

            <Grid container spacing={4} mt={4}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        최근 가입 회원
                    </Typography>
                    <TableContainer component={Paper} elevation={2}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>이름</TableCell>
                                    <TableCell>이메일</TableCell>
                                    <TableCell>역할</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentUsers.map((user) => (
                                    <TableRow key={user.id} hover>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        최근 강의
                    </Typography>
                    <TableContainer component={Paper} elevation={2}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>코드</TableCell>
                                    <TableCell>강의명</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentCourses.map((course) => (
                                    <TableRow key={course.id} hover>
                                        <TableCell>{course.id}</TableCell>
                                        <TableCell>
                                            {course.subjectCode}
                                        </TableCell>
                                        <TableCell>{course.name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );
}
