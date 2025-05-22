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

export default function AdminUserList() {
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        // TODO: fetch users from API when endpoint is ready
        const dummyUsers = [
            {
                id: 1,
                name: "홍길동",
                email: "hong@example.com",
                role: "STUDENT",
            },
            {
                id: 2,
                name: "김철수",
                email: "chulsoo@example.com",
                role: "EDUCATOR",
            },
            {
                id: 3,
                name: "이영희",
                email: "younghee@example.com",
                role: "EDUCATOR",
            },
            // 추가 더미 회원...
        ];
        setUsers(dummyUsers);
    }, []);

    const handleEdit = (user) => {
        setEditingId(user.id);
        setEditedData({ ...user });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditedData({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = (userId) => {
        // TODO: 회원 정보 수정 API 호출
        setUsers((prev) => prev.map((u) => (u.id === userId ? editedData : u)));
        setEditingId(null);
        setEditedData({});
    };

    const handleDelete = (userId) => {
        // TODO: 회원 삭제 API 호출
        setUsers((prev) => prev.filter((user) => user.id !== userId));
    };

    const handlePageChange = (_e, value) => {
        setPage(value - 1);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const totalPages = Math.ceil(users.length / rowsPerPage);
    const displayedUsers = users.slice(
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
                <Typography variant="body2">총 {users.length}명</Typography>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>이름</TableCell>
                            <TableCell>이메일</TableCell>
                            <TableCell>역할</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedUsers.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>{user.id}</TableCell>
                                {editingId === user.id ? (
                                    <>
                                        <TableCell>
                                            <TextField
                                                name="name"
                                                value={editedData.name}
                                                onChange={handleChange}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Select
                                                name="role"
                                                value={editedData.role}
                                                onChange={handleChange}
                                                size="small"
                                            >
                                                <MenuItem value="STUDENT">
                                                    STUDENT
                                                </MenuItem>
                                                <MenuItem value="EDUCATOR">
                                                    EDUCATOR
                                                </MenuItem>
                                            </Select>
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
                                                        handleSave(user.id)
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
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell align="right">
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                justifyContent="flex-end"
                                            >
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>
                                                        handleEdit(user)
                                                    }
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        handleDelete(user.id)
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
