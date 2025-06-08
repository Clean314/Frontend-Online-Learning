import { useEffect, useState } from "react";
import { Paper, CircularProgress } from "@mui/material";
import { useParams, useSearchParams } from "react-router-dom";
import { cancelEnrollmentAPI, getMyEnrollmentsAPI } from "../../api/enrollment";
import CourseEnrolledHeader from "../../components/stu_course_my/CourseEnrolledHeader";
import CourseEnrolledTable from "../../components/stu_course_my/CourseEnrolledTable";
import MyPagination from "../../components/stu_course_my/MyPagination";

export default function StuCourseMy() {
    const [refreshFlag, setRefreshFlag] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();
    const initPage = parseInt(searchParams.get("page") || "1", 10);
    const initRows = parseInt(searchParams.get("rowsPerPage") || "10", 10);

    const [items, setItems] = useState([]);

    const [page, setPage] = useState(initPage - 1);
    const [rowsPerPage, setRowsPerPage] = useState(initRows);
    const [loading, setLoading] = useState(true);

    const { enrolledStatus } = useParams();

    // API 호출 및 enrolledStatus에 따른 필터링
    useEffect(() => {
        getMyEnrollmentsAPI()
            .then((data) => {
                let filtered = data;
                if (enrolledStatus === "enrolled")
                    filtered = data.filter((i) => i.status === "ENROLLED");
                if (enrolledStatus === "completed")
                    filtered = data.filter((i) => i.status === "COMPLETED");
                setItems(filtered);
            })
            .catch((e) => console.error("내 수강목록 조회 실패", e))
            .finally(() => setLoading(false));
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

    if (loading) return <CircularProgress />;

    const totalPages = Math.ceil(items.length / rowsPerPage);
    const displayed = items.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Paper sx={{ p: 2 }}>
            <CourseEnrolledHeader
                status={enrolledStatus}
                rowsPerPage={rowsPerPage}
                onChangeRowsPerPage={(e) => {
                    setRowsPerPage(+e.target.value);
                    setPage(0);
                    setSearchParams({ page: "1", rowsPerPage: e.target.value });
                }}
            />
            <CourseEnrolledTable items={displayed} onCancel={cancelEnroll} />
            <MyPagination
                page={page}
                totalPages={totalPages}
                onChange={(_e, v) => {
                    setPage(v - 1);
                    setSearchParams({
                        page: v.toString(),
                        rowsPerPage: rowsPerPage.toString(),
                    });
                }}
            />
        </Paper>
    );
}
