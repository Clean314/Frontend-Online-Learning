import {
    Box,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Pagination,
    Paper,
    Rating,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Chip from "@mui/material/Chip";
import useAuth from "../../hooks/auth/useAuth";
import { getAllCoursesWithStatusAPI } from "../../api/enrollment";
import { getAllCoursesAPI } from "../../api/course";

export default function CourseList() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const initPage = parseInt(searchParams.get("page") || "1", 10);
    const initRowsPerPage = parseInt(
        searchParams.get("rowsPerPage") || "10",
        10
    );
    const initExclude = searchParams.get("excludeEnrolled") === "true";

    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(initPage - 1);
    const [rowsPerPage, setRowsPerPage] = useState(initRowsPerPage);
    const [isExcludeEnrolled, setIsExcludeEnrolled] = useState(initExclude);

    const navigate = useNavigate();

    const difficultyMap = { EASY: 1, MEDIUM: 2, HARD: 3 };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                let data;

                if (user.role === "EDUCATOR") {
                    // 강사인 경우 status 없이 전체 강의만 조회
                    data = await getAllCoursesAPI();
                } else {
                    // 학생인 경우 status 포함 전체 강의
                    data = await getAllCoursesWithStatusAPI();

                    // 체크박스가 켜져 있으면 AVAILABLE 상태만 필터
                    if (isExcludeEnrolled) {
                        data = data.filter((c) => c.status === "AVAILABLE");
                    }
                }

                setCourses(data);
            } catch (err) {
                console.error("강의 목록 조회 실패:", err);
            }
        };

        fetchCourses();
    }, [user.role, isExcludeEnrolled]);

    const totalPages = Math.ceil(courses.length / rowsPerPage);
    const shouldEllipsis = totalPages > 10;
    const boundaryCount = shouldEllipsis ? 1 : totalPages;
    const siblingCount = shouldEllipsis ? 2 : 0;

    const changePage = (_e, newPage) => {
        setPage(newPage - 1);
        setSearchParams({
            page: newPage.toString(),
            rowsPerPage: rowsPerPage.toString(),
            excludeEnrolled: isExcludeEnrolled.toString(),
        });
    };

    const changeRowsPerPage = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setRowsPerPage(newSize);
        setPage(0);
        setSearchParams({
            page: "1",
            rowsPerPage: newSize.toString(),
            excludeEnrolled: isExcludeEnrolled.toString(),
        });
    };

    const toggleExclude = (e) => {
        const checked = e.target.checked;
        setIsExcludeEnrolled(checked);
        setPage(0);
        setSearchParams({
            page: "1",
            rowsPerPage: rowsPerPage.toString(),
            excludeEnrolled: checked.toString(),
        });
    };

    const displayedCourses = courses.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

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
                {/* STUDENT인 경우에만 체크박스 표시 */}
                {user.role === "STUDENT" && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isExcludeEnrolled}
                                onChange={toggleExclude}
                            />
                        }
                        label="수강 중인 강의 제외하기"
                        sx={{ ml: 0, pl: 0 }}
                    />
                )}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                        페이지당:
                    </Typography>
                    <Select
                        size="small"
                        value={rowsPerPage}
                        onChange={changeRowsPerPage}
                    >
                        {[5, 10, 20].map((n) => (
                            <MenuItem key={n} value={n}>
                                {n}개
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            </Box>

            <TableContainer sx={{ tableLayout: "fixed", width: "100%" }}>
                <Table>
                    <colgroup>
                        <col style={{ width: "7%" }} />
                        <col style={{ width: "23%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "13%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "10%" }} />
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
                            <TableCell>강사</TableCell>
                            <TableCell>카테고리</TableCell>
                            <TableCell>난이도</TableCell>
                            <TableCell>학점</TableCell>
                            <TableCell>최대인원</TableCell>
                            <TableCell>여석</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedCourses.map((course) => (
                            <TableRow key={course.course_id} hover>
                                <TableCell>{course.course_id}</TableCell>
                                <TableCell>
                                    <Box
                                        onClick={() =>
                                            navigate(`${course.course_id}`, {
                                                state: {
                                                    courseData: course,
                                                },
                                            })
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
                                <TableCell>{course.educator_name}</TableCell>
                                <TableCell>{course.category}</TableCell>
                                <TableCell>
                                    <Rating
                                        name={`rating-${course.course_id}`}
                                        max={3}
                                        value={difficultyMap[course.difficulty]}
                                        readOnly
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={`${course.point} 학점`}
                                        variant="outlined"
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{course.max_enrollment}명</TableCell>
                                <TableCell>
                                    {course.available_enrollment}명
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
                    onChange={changePage}
                    showFirstButton
                    showLastButton
                    boundaryCount={boundaryCount}
                    siblingCount={siblingCount}
                />
            </Stack>
        </Paper>
    );
}
