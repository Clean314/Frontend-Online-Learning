import {
    Box,
    Chip,
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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function CourseEnrolled() {
    // url 쿼리 스트링 for 페이지, 행 개수 저장
    // ex) /learn/myCourses/total?page=4&rowsPerPage=5
    const [searchParams, setSearchParams] = useSearchParams();

    const initPage = parseInt(searchParams.get("page") || "1", 10);
    const initRowsPerPage = parseInt(
        searchParams.get("rowsPerPage") || "10",
        10
    );

    const [enrollments, setEnrollments] = useState([]); // 수강 신청 강의 리스트
    const [page, setPage] = useState(initPage - 1); // 현재 페이지
    const [rowsPerPage, setRowsPerPage] = useState(initRowsPerPage); // 페이지당 요소 수

    const navigate = useNavigate();
    const { enrolledStatus } = useParams();

    const difficultyMap = {
        EASY: 1,
        MEDIUM: 2,
        HARD: 3,
    };

    // 샘플 데이터 생성
    useEffect(() => {
        const educatorNames = [
            "김철수",
            "이영희",
            "박민수",
            "최유리",
            "홍길동",
        ];

        const statuses = ["ENROLLED", "COMPLETED"];
        const categories = [
            "프로그래밍",
            "데이터베이스",
            "네트워크",
            "보안",
            "AI",
        ];
        const difficulties = ["EASY", "MEDIUM", "HARD"];
        const baseEnroll = new Date(2025, 3, 5, 14, 0, 0);

        const mockData = Array.from({ length: 30 }, (_, i) => {
            const enrolledAt = new Date(baseEnroll);
            enrolledAt.setDate(enrolledAt.getDate() + i);

            return {
                id: i + 1,
                subjectCode: `SUBJ${String(i + 1).padStart(3, "0")}`,
                name: `강의 ${i + 1}`,
                educatorName: educatorNames[i % educatorNames.length],
                status: statuses[i % statuses.length],
                enrolledAt: enrolledAt.toISOString(),
                difficulty: difficulties[i % difficulties.length],
                category: categories[i % categories.length],
            };
        });

        // enrolledStatus에 따라 필터링
        const filtered = mockData.filter((item) => {
            if (enrolledStatus === "enrolled")
                return item.status === "ENROLLED";
            if (enrolledStatus === "completed")
                return item.status === "COMPLETED";
            return true; // 모두 출력
        });

        setEnrollments(filtered);
    }, [enrolledStatus]);

    // 페이지
    const totalPages = Math.ceil(enrollments.length / rowsPerPage);

    const changePage = (_e, newPage) => {
        setPage(newPage - 1);

        setSearchParams({
            page: newPage.toString(),
            rowsPerPage: rowsPerPage.toString(),
        });
    };

    const changeRowsPerPage = (e) => {
        const newRowsPerPage = parseInt(e.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);

        setSearchParams({
            page: "1",
            rowsPerPage: newRowsPerPage.toString(),
        });
    };

    const displayed = enrollments.slice(
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
                <Typography variant="h6">
                    {enrolledStatus === "total"
                        ? "Total"
                        : enrolledStatus === "enrolled"
                          ? "수강중"
                          : "수강 완료"}
                </Typography>
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
                            <TableCell>수강 상태</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayed.map((item, idx) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    {enrollments.length -
                                        (page * rowsPerPage + idx)}
                                </TableCell>
                                <TableCell>{item.subjectCode}</TableCell>
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
                                    onClick={() =>
                                        navigate(
                                            `/courses/${item.id}/classroom`
                                        )
                                    }
                                >
                                    <Typography variant="body2">
                                        {item.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>{item.educatorName}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>
                                    <Rating
                                        name={`rating-${item.id}`}
                                        max={3}
                                        defaultValue={
                                            difficultyMap[item.difficulty]
                                        }
                                        readOnly
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={
                                            item.status === "ENROLLED"
                                                ? "수강 중"
                                                : "수강 완료"
                                        }
                                        size="small"
                                        sx={{
                                            bgcolor:
                                                item.status === "ENROLLED"
                                                    ? "#BFECFF"
                                                    : "#FFCFEF",
                                            color:
                                                item.status === "ENROLLED"
                                                    ? "#005F8A"
                                                    : "#8A0053",
                                            fontWeight: 500,
                                        }}
                                    />
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
                    boundaryCount={1}
                    siblingCount={1}
                />
            </Stack>
        </Paper>
    );
}
