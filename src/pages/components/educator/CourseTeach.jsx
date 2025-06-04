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
    IconButton,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { getMyRegisteredCoursesAPI } from "../../../api/course";
import { deleteCourseAPI } from "../../../api/admin";

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
        } catch (err) {
            console.error("내 강의 목록 조회 실패:", err);
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchCourses();
    }, [user]);

    // 강의 삭제
    const handleDelete = async (courseId) => {
        if (window.confirm("정말 이 강의를 삭제하시겠습니까?")) {
            try {
                await deleteCourseAPI(Number(courseId));

                alert("삭제되었습니다.");

                // 삭제 후 다시 목록 조회
                fetchCourses();
            } catch (error) {
                alert("강의 삭제 중 오류가 발생했습니다.");
                console.log("강의 삭제 실패 : " + error);
            }
        }
    };

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
                        <col style={{ width: "13%" }} />
                        <col style={{ width: "8%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "7%" }} />
                        <col style={{ width: "2%" }} />
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
                            <TableCell align="center">난이도</TableCell>
                            <TableCell align="center">학점</TableCell>
                            <TableCell align="cetner">최대인원</TableCell>
                            <TableCell align="center">수강인원</TableCell>
                            <TableCell align="center">여석</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayed.map((course) => (
                            <TableRow key={course.course_id} hover>
                                <TableCell>{course.course_id}</TableCell>
                                {/* 강의명 */}
                                <TableCell>
                                    <Box
                                        onClick={() =>
                                            navigate(
                                                `/courses/${course.course_id}/classroom`
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
                                {/* 카테고리 */}
                                <TableCell>{course.category}</TableCell>
                                {/* 난이도 */}
                                <TableCell align="center">
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
                                {/* 학점 */}
                                <TableCell align="center">
                                    <Chip
                                        label={`${course.point} 학점`}
                                        variant="outlined"
                                        size="medium"
                                    />
                                </TableCell>
                                {/* 최대 인원 */}
                                <TableCell align="center">
                                    {course.max_enrollment}
                                </TableCell>
                                {/* 수강 인원 */}
                                <TableCell align="center">
                                    {course.max_enrollment -
                                        course.available_enrollment}
                                </TableCell>
                                {/* 여석 */}
                                <TableCell align="center">
                                    {course.available_enrollment}
                                </TableCell>

                                {/* 강의 삭제 버튼 */}
                                <TableCell>
                                    <IconButton
                                        size="medium"
                                        color="error"
                                        title="강의 삭제"
                                        onClick={() =>
                                            handleDelete(course.course_id)
                                        }
                                    >
                                        <DeleteOutlinedIcon fontSize="small" />
                                    </IconButton>
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
