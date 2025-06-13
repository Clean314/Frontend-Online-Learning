import { useState, useEffect } from "react";
import { Box, Table, TableBody } from "@mui/material";
import {
    getCourseUpdateListAPI,
    findCourseAPI,
    updateCourseAPI,
    deleteCourseAPI,
} from "../../api/admin";
import DataTableContainer from "../../components/admin/common/DataTableContainer";
import FilterBar from "../../components/admin/common/FilterBar";
import PaginationControls from "../../components/admin/common/PaginationControls";
import CourseRow from "../../components/admin/course/CourseRow";
import CourseTableHeader from "../../components/admin/course/CourseTableHeader";

/**
 * 관리자 - 전체 강의 목록 조회/수정/삭제 페이지
 */
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
                    alert("수강생이 존재하는 강의는 삭제할 수 없습니다.");
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
            <FilterBar
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                searchValue={searchName}
                onSearchChange={(e) => setSearchName(e.target.value)}
                onSearch={handleSearch}
                totalCount={courses.length}
            />

            <DataTableContainer>
                <Table>
                    <CourseTableHeader />
                    <TableBody>
                        {displayed.map((course) => (
                            <CourseRow
                                key={course.course_id}
                                course={course}
                                isEditing={editingId === course.course_id}
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
