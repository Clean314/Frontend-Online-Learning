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

export default function CourseList() {
    const [searchParams, setSearchParams] = useSearchParams();

    const initPage = parseInt(searchParams.get("page") || "1", 10);
    const initRowsPerPage = parseInt(
        searchParams.get("rowsPerPage") || "10",
        10
    );
    const initExclude = searchParams.get("excludeEnrolled") === "true";

    const [courses, setCourses] = useState([]); // 전체 강의 리스트
    const [page, setPage] = useState(initPage - 1); // 현재 페이지
    const [rowsPerPage, setRowsPerPage] = useState(initRowsPerPage); // 페이지당 요소 수
    const [isExcludeEnrolled, setIsExcludeEnrolled] = useState(initExclude); // 수강 중 강의 제외 여부

    const navigate = useNavigate();

    const difficultyMap = {
        EASY: 1,
        MEDIUM: 2,
        HARD: 3,
    };

    // 20개 샘플 데이터 생성
    useEffect(() => {
        const educatorNames = [
            "김철수",
            "이영희",
            "박민수",
            "최유리",
            "홍길동",
        ];
        const categories = [
            "프로그래밍",
            "데이터베이스",
            "네트워크",
            "보안",
            "AI",
        ];
        const difficulties = ["EASY", "MEDIUM", "HARD"];
        const baseCreated = new Date(2025, 3, 1, 9, 0, 0);
        const baseUpdated = new Date(2025, 3, 1, 10, 0, 0);

        const mockData = Array.from({ length: 100 }, (_, i) => {
            const created = new Date(baseCreated);
            created.setDate(created.getDate() + i);

            const updated = new Date(baseUpdated);
            updated.setDate(updated.getDate() + i);

            return {
                id: i + 1,
                subjectCode: `SUBJ${String(i + 1).padStart(3, "0")}`,
                name: `강의 ${i + 1}`,
                createdAt: created.toISOString(),
                updatedAt: updated.toISOString(),
                educatorName: educatorNames[i % educatorNames.length],
                difficulty: difficulties[i % difficulties.length],
                category: categories[i % categories.length],
            };
        });
        setCourses(mockData);
    }, []);

    // 페이지네이션
    const totalPages = Math.ceil(courses.length / rowsPerPage);

    // 페이지 수가 10을 넘을 때만 페이지 버튼 생략
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
        const newRowsPerPage = parseInt(e.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);

        setSearchParams({
            page: "1",
            rowsPerPage: newRowsPerPage.toString(),
            excludeEnrolled: isExcludeEnrolled.toString(),
        });
    };

    // 현재 페이지에 해당하는 데이터 슬라이싱
    const displayedCourses = courses.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // 목록에서 수강 신청한 강의 제외
    const excludeEnrolledCourses = (e) => {
        const checked = e.target.checked;
        setIsExcludeEnrolled(checked);
        setPage(0);

        setSearchParams({
            page: "1",
            rowsPerPage: rowsPerPage.toString(),
            excludeEnrolled: checked.toString(),
        });

        // TODO: 실제 API 연동
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
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isExcludeEnrolled}
                            onChange={excludeEnrolledCourses}
                        />
                    }
                    label="수강중인 강의 제외하기 (미구현)"
                    sx={{ ml: 0, pl: 0 }}
                />
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

            <TableContainer
                sx={{
                    tableLayout: "fixed", // ① 고정 레이아웃
                    width: "100%", // 가로 채우기
                }}
            >
                <Table>
                    <colgroup>
                        <col style={{ width: "7%" }} />
                        <col style={{ width: "13%" }} />
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "5%" }} />
                        <col style={{ width: "15%" }} />
                    </colgroup>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "grey.100" }}>
                            <TableCell>#</TableCell>
                            <TableCell>과목코드</TableCell>
                            <TableCell>강의명</TableCell>
                            <TableCell>강사</TableCell>
                            <TableCell>카테고리</TableCell>
                            <TableCell>난이도</TableCell>
                            <TableCell>등록일</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedCourses.map((course, index) => (
                            <TableRow key={course.id}>
                                <TableCell>
                                    {courses.length -
                                        (page * rowsPerPage + index)}
                                </TableCell>
                                <TableCell>{course.subjectCode}</TableCell>
                                <TableCell
                                    sx={{
                                        width: "100%",
                                        transition: "all 0.15s ease-in-out",
                                        "&:hover": {
                                            transform: "scale(1.1)",
                                            color: "#B1AFFF",
                                            fontWeight: 600,
                                        },
                                        cursor: "pointer",
                                        display: "inline-block",
                                    }}
                                    onClick={() => navigate(`${course.id}`)}
                                >
                                    <Typography variant="body2">
                                        {course.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>{course.educatorName}</TableCell>
                                <TableCell>{course.category}</TableCell>
                                <TableCell>
                                    <Rating
                                        name={`rating-${course.id}`}
                                        max={3}
                                        defaultValue={
                                            difficultyMap[course.difficulty]
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Stack alignItems="center" mt={2}>
                <Pagination
                    count={totalPages} // 전체 페이지 수
                    page={page + 1} // Pagination은 1부터 시작
                    onChange={changePage}
                    showFirstButton // 첫 페이지로 이동 버튼
                    showLastButton // 마지막 페이지로 이동 버튼
                    boundaryCount={boundaryCount} // 첫/끝에서 고정 버튼 개수
                    siblingCount={siblingCount} // 현재 페이지 양쪽 버튼 개수
                />
            </Stack>
        </Paper>
    );
}
