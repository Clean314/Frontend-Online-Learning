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
import { getAdminDashboardAPI } from "../../../api/admin";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        userCount: 0,
        courseCount: 0,
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentCourses, setRecentCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { members, courses, totalMember, totalCourses } =
                    await getAdminDashboardAPI();

                setStats({
                    userCount: totalMember,
                    courseCount: totalCourses,
                });

                // 최근 5개 데이터만 화면에 표시
                setRecentUsers(members.slice(0, 5));
                setRecentCourses(courses.slice(0, 5));
            } catch (error) {
                console.error("대시보드 데이터 로드 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
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
    ];

    return (
        <Box p={3}>
            <Grid container spacing={2}>
                {cards.map((card) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={card.title}>
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
                <Grid size={{ xs: 12, md: 6 }}>
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

                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" gutterBottom>
                        최근 강의
                    </Typography>
                    <TableContainer component={Paper} elevation={2}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>카테고리</TableCell>
                                    <TableCell>강의명</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {recentCourses.map((course) => (
                                    <TableRow key={course.course_id} hover>
                                        <TableCell>
                                            {course.course_id}
                                        </TableCell>
                                        <TableCell>{course.category}</TableCell>
                                        <TableCell>
                                            {course.course_name}
                                        </TableCell>
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
