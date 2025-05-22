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
import { getMyEnrollmentsAPI } from "../../../api/enrollment";

export default function CourseEnrolled() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initPage = parseInt(searchParams.get("page") || "1", 10);
    const initRowsPerPage = parseInt(
        searchParams.get("rowsPerPage") || "10",
        10
    );

    const [enrollments, setEnrollments] = useState([]);
    const [page, setPage] = useState(initPage - 1);
    const [rowsPerPage, setRowsPerPage] = useState(initRowsPerPage);

    const navigate = useNavigate();
    const { enrolledStatus } = useParams();

    // 난이도 → 별점 매핑
    const difficultyMap = { EASY: 1, MEDIUM: 2, HARD: 3 };

    // API 호출 및 enrolledStatus에 따른 필터링
    useEffect(() => {
        (async () => {
            try {
                const data = await getMyEnrollmentsAPI();
                let filtered = data;

                if (enrolledStatus === "enrolled") {
                    filtered = data.filter(
                        (item) => item.status === "ENROLLED"
                    );
                } else if (enrolledStatus === "completed") {
                    filtered = data.filter(
                        (item) => item.status === "COMPLETED"
                    );
                }

                setEnrollments(filtered);
            } catch (err) {
                console.error("내 수강목록 조회 실패", err);
            }
        })();
    }, [enrolledStatus]);

    const totalPages = Math.ceil(enrollments.length / rowsPerPage);

    const changePage = (_e, newPage) => {
        setPage(newPage - 1);
        setSearchParams({
            page: newPage.toString(),
            rowsPerPage: rowsPerPage.toString(),
        });
    };

    const changeRowsPerPage = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setRowsPerPage(newSize);
        setPage(0);
        setSearchParams({ page: "1", rowsPerPage: newSize.toString() });
    };

    const displayed = enrollments.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Paper sx={{ p: 2 }}>
            {/* 헤더 */}
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

            {/* 테이블 */}
            <TableContainer sx={{ tableLayout: "fixed", width: "100%" }}>
                <Table>
                    <colgroup>
                        <col style={{ width: "7%" }} />
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "5%" }} />
                        <col style={{ width: "8%" }} />
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
                            <TableCell>강의명</TableCell>
                            <TableCell>강사</TableCell>
                            <TableCell>카테고리</TableCell>
                            <TableCell>난이도</TableCell>
                            <TableCell>잔여 인원</TableCell>
                            <TableCell>수강 상태</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayed.map((item, idx) => (
                            <TableRow key={item.course_id} hover>
                                {/* 역순 넘버링 */}
                                <TableCell>
                                    {enrollments.length -
                                        (page * rowsPerPage + idx)}
                                </TableCell>

                                {/* 강의명 클릭 이동 */}
                                <TableCell>
                                    <Box
                                        onClick={() =>
                                            navigate(
                                                `/courses/${item.course_id}/classroom`
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
                                            {item.course_name}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                <TableCell>{item.educator_name}</TableCell>
                                <TableCell>{item.category}</TableCell>

                                {/* 난이도 */}
                                <TableCell>
                                    <Rating
                                        name={`rating-${item.course_id}`}
                                        max={3}
                                        defaultValue={
                                            difficultyMap[item.difficulty]
                                        }
                                        readOnly
                                        size="small"
                                    />
                                </TableCell>

                                {/* 학점 */}
                                <TableCell>
                                    <Chip
                                        label={`${item.point} 학점`}
                                        variant="outlined"
                                        size="medium"
                                    />
                                </TableCell>

                                {/* 수강 상태 */}
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

            {/* 페이징 */}
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
