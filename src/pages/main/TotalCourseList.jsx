import { useEffect, useState } from "react";
import { Paper } from "@mui/material";
import useAuth from "../../hooks/auth/useAuth";
import { getAllCoursesWithStatusAPI } from "../../api/enrollment";
import { getAllCoursesAPI } from "../../api/course";
import { ROLES } from "../../roles";
import CourseListFilter from "../../components/course_list/CourseListFilter";
import CourseListTable from "../../components/course_list/CourseListTable";
import MyPagination from "../../components/course_list/MyPagination";

export default function TotalCourseList() {
    const { user } = useAuth();

    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isExcludeEnrolled, setIsExcludeEnrolled] = useState(false);

    const difficultyMap = { EASY: 1, MEDIUM: 2, HARD: 3 };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                let data =
                    user.role === ROLES.EDUCATOR
                        ? await getAllCoursesAPI()
                        : await getAllCoursesWithStatusAPI();

                if (user.role === ROLES.STUDENT && isExcludeEnrolled) {
                    data = data.filter((c) => c.status === "AVAILABLE");
                }

                setCourses(data);
            } catch (err) {
                console.error("강의 목록 조회 실패:", err);
            }
        };

        fetchCourses();
    }, [user.role, isExcludeEnrolled]);

    const totalPages = Math.ceil(courses.length / rowsPerPage);
    const displayed = courses.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );
    const boundaryCount = totalPages > 10 ? 1 : totalPages;
    const siblingCount = totalPages > 10 ? 2 : 0;

    return (
        <Paper sx={{ p: 2 }}>
            <CourseListFilter
                role={user.role}
                excludeEnrolled={isExcludeEnrolled}
                onToggleExclude={(e) => setIsExcludeEnrolled(e.target.checked)}
                rowsPerPage={rowsPerPage}
                onChangeRowsPerPage={(e) => {
                    setRowsPerPage(+e.target.value);
                    setPage(0);
                }}
            />
            <CourseListTable
                courses={displayed}
                difficultyMap={difficultyMap}
            />
            <MyPagination
                page={page}
                totalPages={totalPages}
                onChange={(_e, v) => setPage(v - 1)}
                boundaryCount={boundaryCount}
                siblingCount={siblingCount}
            />
        </Paper>
    );
}
