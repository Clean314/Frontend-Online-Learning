import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/auth/useAuth";
import {
    Box,
    Paper,
    Typography,
    Select,
    MenuItem,
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
    TextField,
    Button,
} from "@mui/material";
import { getMyRegisteredCoursesAPI } from "../../../api/course";

export default function CourseTeach() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // 검색 state
    const [searchName, setSearchName] = useState("");
    const [searchCategory, setSearchCategory] = useState("");

    useEffect(() => {
        if (!user) return;

        const fetchCourses = async () => {
            try {
                const data = await getMyRegisteredCoursesAPI();
                setCourses(data);
            } catch (err) {
                console.error("내 강의 목록 조회 실패:", err);
            }
        };

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

    const search = () => {
        console.log("검색어:", searchName, "카테고리:", searchCategory);
        setPage(0);
        // TODO: 실제 API 연동하여 검색 요청
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Box
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        search();
                    }}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <TextField
                        label="강의명 검색"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        size="small"
                    />
                    <FormControl size="small">
                        <Select
                            displayEmpty
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                        >
                            <MenuItem value="">전체</MenuItem>
                            {[
                                "프로그래밍",
                                "데이터베이스",
                                "네트워크",
                                "보안",
                                "AI",
                            ].map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained">
                        검색
                    </Button>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
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
            </Box>

            <TableContainer sx={{ tableLayout: "fixed", width: "100%" }}>
                <Table>
                    <colgroup>
                        <col style={{ width: "7%" }} />
                        <col style={{ width: "13%" }} />
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "12%" }} />
                        <col style={{ width: "12%" }} />
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
                            <TableCell>#</TableCell>
                            <TableCell>과목코드</TableCell>
                            <TableCell>강의명</TableCell>
                            <TableCell>카테고리</TableCell>
                            <TableCell>난이도</TableCell>
                            <TableCell>등록일</TableCell>
                            <TableCell>수정일</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayed.map((course, idx) => (
                            <TableRow key={course.id} hover>
                                <TableCell>
                                    {courses.length -
                                        (page * rowsPerPage + idx)}
                                </TableCell>
                                <TableCell>{course.subjectCode}</TableCell>
                                <TableCell>
                                    <Box
                                        onClick={() =>
                                            navigate(`/courses/${course.id}`)
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
                                            {course.name}
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
