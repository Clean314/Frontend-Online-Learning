import React, { useState, useEffect } from "react";
import {
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
    Box,
    TextField,
    Select,
    MenuItem,
    Pagination,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
} from "@mui/icons-material";

export default function AdminCourseList() {
    const [courses, setCourses] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        // TODO: 전체 강의 조회 API
        const categories = [
            "프로그래밍",
            "데이터베이스",
            "네트워크",
            "보안",
            "AI",
        ];
        const difficulties = ["EASY", "MEDIUM", "HARD"];
        const educatorNames = [
            "김철수",
            "이영희",
            "박민수",
            "최유리",
            "홍길동",
        ];

        const dummyCourses = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            course_name: `강의 ${i + 1}`,
            educatorName: educatorNames[i % educatorNames.length],
            category: categories[i % categories.length],
            difficulty: difficulties[i % difficulties.length],
            point: (i % 3) + 1,
            maxEnrollment: Math.floor(Math.random() * 91) + 10,
        }));

        setCourses(dummyCourses);
    }, []);

    const handleEdit = (course) => {
        setEditingId(course.id);
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

    const handleSave = (id) => {
        // TODO: 강의 수정 API(강의명, 카테고리, 난이도, 학점, 최대인원)
        setCourses((prev) => prev.map((c) => (c.id === id ? editedData : c)));
        setEditingId(null);
        setEditedData({});
    };

    const handleDelete = (id) => {
        // TODO: 강의 삭제 API
        setCourses((prev) => prev.filter((c) => c.id !== id));
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
                    >
                        {[5, 10, 20].map((n) => (
                            <MenuItem key={n} value={n}>
                                {n}개
                            </MenuItem>
                        ))}
                    </Select>
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
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayed.map((course) => (
                            <TableRow key={course.id} hover>
                                <TableCell>{course.id}</TableCell>
                                {editingId === course.id ? (
                                    <>
                                        <TableCell>
                                            <TextField
                                                name="course_name"
                                                value={editedData.course_name}
                                                onChange={handleChange}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {course.educatorName}
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                name="category"
                                                value={editedData.category}
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
                                                value={editedData.difficulty}
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
                                                value={editedData.point}
                                                onChange={handleChange}
                                                size="small"
                                            >
                                                {["1", "2", "3"].map((d) => (
                                                    <MenuItem key={d} value={d}>
                                                        {d}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                name="maxEnrollment"
                                                type="number"
                                                value={editedData.maxEnrollment}
                                                onChange={handleChange}
                                                size="small"
                                                slotProps={{
                                                    htmlInput: {
                                                        min: 10,
                                                        max: 100,
                                                    },
                                                }}
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
                                                        handleSave(course.id)
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
                                            {course.educatorName}
                                        </TableCell>
                                        <TableCell>{course.category}</TableCell>
                                        <TableCell>
                                            {course.difficulty}
                                        </TableCell>
                                        <TableCell>{course.point}</TableCell>
                                        <TableCell>
                                            {course.maxEnrollment}
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
                                                        handleDelete(course.id)
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
