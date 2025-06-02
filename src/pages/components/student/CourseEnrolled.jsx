import {
    Box,
    Chip,
    IconButton,
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
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
    cancelEnrollmentAPI,
    getMyEnrollmentsAPI,
} from "../../../api/enrollment";

export default function CourseEnrolled() {
    const [refreshFlag, setRefreshFlag] = useState(false);

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
    }, [enrolledStatus, refreshFlag]);

    // 수강 취소
    const cancelEnroll = async (courseId) => {
        try {
            await cancelEnrollmentAPI(Number(courseId));

            alert("수강이 취소되었습니다.");
            setRefreshFlag((prev) => !prev);
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                    "수강 취소 중 오류가 발생했습니다."
            );
        }
    };

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
                            <TableCell>강사</TableCell>
                            <TableCell>카테고리</TableCell>
                            <TableCell>난이도</TableCell>
                            <TableCell>잔여 인원</TableCell>
                            <TableCell>수강 상태</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayed.map((item) => (
                            <TableRow key={item.course_id} hover>
                                <TableCell>{item.course_id}</TableCell>

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
                                                : item.status === "COMPLETED"
                                                  ? "수강 완료"
                                                  : "수강 취소"
                                        }
                                        size="small"
                                        sx={{
                                            bgcolor:
                                                item.status === "ENROLLED"
                                                    ? "#BFECFF"
                                                    : "#F8D7DA",
                                            color:
                                                item.status === "ENROLLED"
                                                    ? "#005F8A"
                                                    : "#721C24",
                                            fontWeight: 500,
                                        }}
                                    />
                                </TableCell>

                                {/* item.status === "ENROLLED"일 때만 '수강 취소' 버튼 표시 */}
                                <TableCell align="right">
                                    {item.status === "ENROLLED" && (
                                        <IconButton
                                            size="medium"
                                            color="error"
                                            title="수강 취소"
                                            onClick={() =>
                                                cancelEnroll(item.course_id)
                                            }
                                        >
                                            <DeleteOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    )}
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
