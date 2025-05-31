import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/auth/useAuth";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Pagination,
    Rating,
    FormControl,
    Stack,
    Select,
    MenuItem,
    Chip,
} from "@mui/material";
import { getMyRegisteredCoursesAPI } from "../../../api/course";

export default function CourseTeach() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // 강의 목록 조회
    const fetchCourses = async () => {
        try {
            const data = await getMyRegisteredCoursesAPI();
            setCourses(data);
            console.log(data);
        } catch (err) {
            console.error("내 강의 목록 조회 실패:", err);
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchCourses();
    }, [user]);

    const totalPages = Math.ceil(courses.length / rowsPerPage);

    const handlePageChange = (_e, value) => {
        setPage(value - 1);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const displayed = courses.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Paper sx={{ p: 2 }}>
            {/* 페이지당 설정 */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    mb: 2,
                }}
            >
                <Typography variant="body2" sx={{ mr: 1 }}>
                    페이지당:
                </Typography>
                <FormControl size="small">
                    <Select
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                    >
                        {[5, 10, 20].map((n) => (
                            <MenuItem key={n} value={n}>
                                {n}개
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <TableContainer sx={{ tableLayout: "fixed", width: "100%" }}>
                <Table>
                    <colgroup>
                        <col style={{ width: "6%" }} />
                        <col style={{ width: "27%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "8%" }} />
                        <col style={{ width: "8%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "13%" }} />
                        <col style={{ width: "13%" }} />
                    </colgroup>
                    <TableHead>
                        <TableRow
                            sx={{
                                bgcolor: (theme) =>
                                    theme.palette.mode === "dark"
                                        ? theme.palette.grey[800]
                                        : theme.palette.grey[100],
                            }}
                        >
                            <TableCell>ID</TableCell>
                            <TableCell>강의명</TableCell>
                            <TableCell>카테고리</TableCell>
                            <TableCell>난이도</TableCell>
                            <TableCell>학점</TableCell>
                            <TableCell>최대인원</TableCell>
                            <TableCell>등록일</TableCell>
                            <TableCell>수정일</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayed.map((course) => (
                            <TableRow key={course.course_id} hover>
                                <TableCell>{course.course_id}</TableCell>
                                <TableCell>
                                    <Box
                                        onClick={() =>
                                            navigate(
                                                `/courses/${course.course_id}`,
                                                {
                                                    state: {
                                                        courseData: course,
                                                    },
                                                }
                                            )
                                        }
                                        sx={{
                                            display: "inline-block",
                                            width: "100%",
                                            transition: "all 0.15s ease-in-out",
                                            "&:hover": {
                                                transform: "scale(1.1)",
                                                color: "#B1AFFF",
                                                fontWeight: 600,
                                            },
                                            cursor: "pointer",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        <Typography variant="body2">
                                            {course.course_name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{course.category}</TableCell>
                                <TableCell>
                                    <Rating
                                        name="difficulty"
                                        max={3}
                                        value={
                                            { EASY: 1, MEDIUM: 2, HARD: 3 }[
                                                course.difficulty
                                            ]
                                        }
                                        readOnly
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={`${course.point} 학점`}
                                        variant="outlined"
                                        size="medium"
                                    />
                                </TableCell>
                                <TableCell>{course.max_enrollment}</TableCell>
                                <TableCell>
                                    {new Date(
                                        course.createdAt
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {new Date(
                                        course.updatedAt
                                    ).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Stack alignItems="center" mt={2}>
                <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={handlePageChange}
                    showFirstButton
                    showLastButton
                />
            </Stack>
        </Paper>
    );
}
