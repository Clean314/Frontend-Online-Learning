import React, { useState, useEffect } from "react";
import {
    Box,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    IconButton,
    Stack,
    Typography,
    Select,
    MenuItem,
    Pagination,
    TextField,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import {
    getCourseUpdateListAPI,
    findCourseAPI,
    updateCourseAPI,
    deleteCourseAPI,
} from "../../../api/admin";

export default function AdminCourseList() {
    const [courses, setCourses] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [searchName, setSearchName] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await getCourseUpdateListAPI();
            setCourses(data);
        } catch (error) {
            console.error("강의 리스트 로드 실패:", error);
        }
    };

    const handleSearch = async () => {
        try {
            if (searchName.trim()) {
                const results = await findCourseAPI(searchName.trim());
                setCourses(results);
            } else {
                await fetchCourses();
            }
            setPage(0);
        } catch (error) {
            if (error.response) {
                const statusCode = error.response.status;
                const message = error.response.data;

                if (statusCode === 404) {
                    // 404
                    alert(message); // "일치하는 강의가 없습니다."
                } else {
                    console.error(
                        "강의 검색 중 오류 발생:",
                        statusCode,
                        message
                    );
                }
            } else {
                console.error("서버와 통신 중 오류가 발생했습니다.", error);
            }
        }
    };

    const handleEdit = (course) => {
        setEditingId(course.course_id);
        setEditedData({ ...course });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditedData({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (id) => {
        const payload = {
            courseName: editedData.course_name,
            category: editedData.category,
            difficulty: editedData.difficulty,
            point: editedData.point,
            maxEnrollment: editedData.max_enrollment,
        };

        try {
            await updateCourseAPI(id, payload);
            await fetchCourses();
            handleCancel();
        } catch (error) {
            console.error("강의 정보 수정 실패:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            const message = await deleteCourseAPI(id);
            alert(message);
            setCourses((prev) => prev.filter((c) => c.course_id !== id));
        } catch (error) {
            if (error.response) {
                const statusCode = error.response.status;
                const message = error.response.data;

                if (statusCode === 404) {
                    // 404 Not Found
                    alert(message); // "해당 강의를 찾을 수 없습니다."
                } else if (statusCode === 400) {
                    // 400 Bad Request
                    alert(message); // "해당 강의의 상태를 확인 후 삭제해주세요."
                } else {
                    alert(
                        `알 수 없는 오류가 발생했습니다. (${statusCode})\n${message}`
                    );
                }
            } else {
                alert("서버와 통신 중 오류가 발생했습니다.");
                console.error("강의 삭제 실패:", error);
            }
        }
    };

    const handlePageChange = (_e, value) => {
        setPage(value - 1);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const totalPages = Math.ceil(courses.length / rowsPerPage);
    const displayed = courses.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box p={3}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                        페이지당:
                    </Typography>
                    <Select
                        size="small"
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        sx={{ mr: 2 }}
                    >
                        {[5, 10, 20].map((n) => (
                            <MenuItem key={n} value={n}>
                                {n}개
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField
                        size="small"
                        placeholder="강의명 검색"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        sx={{ mr: 1, width: 200 }}
                    />
                    <IconButton color="primary" onClick={handleSearch}>
                        <SearchIcon />
                    </IconButton>
                </Box>

                <Typography variant="body2">총 {courses.length}개</Typography>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>강의명</TableCell>
                            <TableCell>강사</TableCell>
                            <TableCell>카테고리</TableCell>
                            <TableCell>난이도</TableCell>
                            <TableCell>학점</TableCell>
                            <TableCell>최대인원</TableCell>
                            <TableCell align="right" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayed.map((course) => (
                            <TableRow key={course.course_id} hover>
                                <TableCell>{course.course_id}</TableCell>
                                {editingId === course.course_id ? (
                                    <>
                                        <TableCell>
                                            <TextField
                                                name="course_name"
                                                value={
                                                    editedData.course_name || ""
                                                }
                                                onChange={handleChange}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {course.educator_name}
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                name="category"
                                                value={
                                                    editedData.category || ""
                                                }
                                                onChange={handleChange}
                                                size="small"
                                            >
                                                {[
                                                    "프로그래밍",
                                                    "데이터베이스",
                                                    "네트워크",
                                                    "보안",
                                                    "AI",
                                                ].map((cat) => (
                                                    <MenuItem
                                                        key={cat}
                                                        value={cat}
                                                    >
                                                        {cat}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                name="difficulty"
                                                value={
                                                    editedData.difficulty || ""
                                                }
                                                onChange={handleChange}
                                                size="small"
                                            >
                                                {["EASY", "MEDIUM", "HARD"].map(
                                                    (d) => (
                                                        <MenuItem
                                                            key={d}
                                                            value={d}
                                                        >
                                                            {d}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                name="point"
                                                value={editedData.point ?? ""}
                                                onChange={handleChange}
                                                size="small"
                                            >
                                                {[1, 2, 3].map((p) => (
                                                    <MenuItem key={p} value={p}>
                                                        {p}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="max_enrollment"
                                                type="number"
                                                inputProps={{
                                                    min: 10,
                                                    max: 100,
                                                }}
                                                value={
                                                    editedData.max_enrollment ||
                                                    ""
                                                }
                                                onChange={handleChange}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                justifyContent="flex-end"
                                            >
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleSave(
                                                            course.course_id
                                                        )
                                                    }
                                                >
                                                    <SaveIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="inherit"
                                                    onClick={handleCancel}
                                                >
                                                    <CancelIcon />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell>
                                            {course.course_name}
                                        </TableCell>
                                        <TableCell>
                                            {course.educator_name}
                                        </TableCell>
                                        <TableCell>{course.category}</TableCell>
                                        <TableCell>
                                            {course.difficulty}
                                        </TableCell>
                                        <TableCell>{course.point}</TableCell>
                                        <TableCell>
                                            {course.max_enrollment}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                justifyContent="flex-end"
                                            >
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleEdit(course)
                                                    }
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        handleDelete(
                                                            course.course_id
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </>
                                )}
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
                    boundaryCount={1}
                    siblingCount={1}
                />
            </Stack>
        </Box>
    );
}
