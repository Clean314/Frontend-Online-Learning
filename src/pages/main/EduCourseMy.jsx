import { useEffect, useState } from "react";
import useAuth from "../../hooks/auth/useAuth";
import { Box, Paper, Pagination, Stack, CircularProgress } from "@mui/material";
import { getMyRegisteredCoursesAPI } from "../../api/course";
import { deleteCourseAPI } from "../../api/admin";

import PageSizeSelect from "../../components/table/PageSizeSelect";
import CoursesTable from "../../components/table/CoursesTable";

export default function EduCourseMy() {
    const { user } = useAuth();

    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);

    // 강의 목록 조회
    const fetchCourses = async () => {
        try {
            const data = await getMyRegisteredCoursesAPI();
            setCourses(data);
        } catch (err) {
            console.error("내 강의 목록 조회 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchCourses();
    }, [user]);

    // 강의 삭제
    const handleDelete = async (course) => {
        const enrolledCount =
            course.max_enrollment - course.available_enrollment;
        if (enrolledCount > 0) {
            alert("수강 중인 학생이 존재하는 강의는 삭제할 수 없습니다");
            return;
        }

        if (window.confirm("정말 이 강의를 삭제하시겠습니까?")) {
            try {
                await deleteCourseAPI(Number(course.course_id));

                alert("삭제되었습니다.");

                // 삭제 후 다시 목록 조회
                fetchCourses();
            } catch (error) {
                alert("강의 삭제 중 오류가 발생했습니다.");
                console.log("강의 삭제 실패 : " + error);
            }
        }
    };

    // 페이징
    const totalPages = Math.ceil(courses.length / rowsPerPage);

    const handlePageChange = (_e, value) => {
        setPage(value - 1);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const displayed = courses.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper sx={{ p: 2 }}>
            <PageSizeSelect
                rowsPerPage={rowsPerPage}
                onChange={handleRowsPerPageChange}
            />

            <CoursesTable courses={displayed} onDelete={handleDelete} />

            <Stack alignItems="center" mt={2}>
                <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={handlePageChange}
                    showFirstButton
                    showLastButton
                />
            </Stack>
        </Paper>
    );
}
