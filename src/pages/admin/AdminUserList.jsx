import { useState, useEffect } from "react";
import { Box, Table, TableBody } from "@mui/material";
import {
    getMemberUpdateListAPI,
    updateMemberAPI,
    deleteMemberAPI,
    findMemberAPI,
} from "../../api/admin";
import PaginationControls from "../../components/admin/common/PaginationControls";
import DataTableContainer from "../../components/admin/common/DataTableContainer";
import FilterBar from "../../components/admin/common/FilterBar";
import UserRow from "../../components/admin/user/UserRow";
import UserTableHeader from "../../components/admin/user/UserTableHeader";

/**
 * 관리자 - 전체 사용자 목록 조회/수정/삭제 페이지
 */
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
                console.log(results);
                setUsers(results);
            } else {
                fetchUsers();
            }
            setPage(0);
        } catch (error) {
            if (error.response) {
                const statusCode = error.response.status;
                const message = error.response.data;

                if (statusCode === 404) {
                    // 404
                    alert(message); // "일치하는 사용자가 없습니다."
                } else {
                    console.error(
                        "유저 검색 중 오류 발생:",
                        statusCode,
                        message
                    );
                }
            } else {
                console.error("서버와 통신 중 오류가 발생했습니다.", error);
            }
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
            const message = await deleteMemberAPI(userId);
            alert(message);
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (error) {
            if (error.response) {
                const statusCode = error.response.status;
                const message = error.response.data;

                if (statusCode === 404) {
                    // 404 Not Found
                    alert(message); // "사용자를 찾을 수 없습니다."
                } else if (statusCode === 400) {
                    // 400 Bad Request
                    alert(
                        "수강 신청 또는 개설한 강의가 존재하는 사용자는 삭제할 수 없습니다."
                    );
                } else {
                    alert(
                        `알 수 없는 오류가 발생했습니다. (${statusCode})\n${message}`
                    );
                }
            } else {
                alert("서버와 통신 중 오류가 발생했습니다.");
                console.error("유저 삭제 실패:", error);
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

    const totalPages = Math.ceil(users.length / rowsPerPage);
    const displayed = users.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box p={3}>
            <FilterBar
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                searchValue={searchName}
                onSearchChange={(e) => setSearchName(e.target.value)}
                onSearch={handleSearch}
                totalCount={users.length}
            />

            <DataTableContainer>
                <Table>
                    <UserTableHeader />
                    <TableBody>
                        {displayed.map((user) => (
                            <UserRow
                                key={user.id}
                                user={user}
                                isEditing={editingId === user.id}
                                editedData={editedData}
                                onEdit={handleEdit}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                onDelete={handleDelete}
                                onChange={handleChange}
                            />
                        ))}
                    </TableBody>
                </Table>
            </DataTableContainer>

            <PaginationControls
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </Box>
    );
}
