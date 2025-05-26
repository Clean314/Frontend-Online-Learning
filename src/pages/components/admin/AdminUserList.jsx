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
    getMemberUpdateListAPI,
    findMemberAPI,
    updateMemberAPI,
    deleteMemberAPI,
} from "../../../api/admin";

export default function AdminUserList() {
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [searchName, setSearchName] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getMemberUpdateListAPI();
            setUsers(data);
        } catch (error) {
            console.error("유저 리스트 로드 실패:", error);
        }
    };

    const handleSearch = async () => {
        try {
            if (searchName.trim()) {
                const results = await findMemberAPI(searchName.trim());
                setUsers(results);
            } else {
                fetchUsers();
            }
            setPage(0);
        } catch (error) {
            console.error("유저 검색 실패:", error);
        }
    };

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

    const handleSave = async (userId) => {
        try {
            await updateMemberAPI(userId, {
                name: editedData.name,
                role: editedData.role,
            });
            await fetchUsers();
            handleCancel();
        } catch (error) {
            console.error("유저 정보 수정 실패:", error);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await deleteMemberAPI(userId);
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (error) {
            console.error("유저 삭제 실패:", error);
        }
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
                {/* 좌측: 페이지당 + 검색란 */}
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
                        placeholder="이름 검색"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        sx={{ mr: 1, width: 200 }}
                    />
                    <IconButton color="primary" onClick={handleSearch}>
                        <SearchIcon />
                    </IconButton>
                </Box>

                {/* 우측: 총 개수 */}
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
                            <TableCell align="right" />
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
                                                <MenuItem value="ADMIN">
                                                    ADMIN
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
