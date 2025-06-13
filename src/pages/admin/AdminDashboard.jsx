import { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAdminDashboardAPI } from "../../api/admin";
import RecentSection from "../../components/admin/dashboard/RecentSection";
import DashboardNav from "../../components/admin/dashboard/DashboardNav";
import DashboardStats from "../../components/admin/dashboard/DashboardStats";

/**
 * 관리자 대시보드 페이지
 */
export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        userCount: 0,
        courseCount: 0,
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentCourses, setRecentCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { members, courses, totalMember, totalCourses } =
                    await getAdminDashboardAPI();

                console.log(members);

                setStats({
                    userCount: totalMember,
                    courseCount: totalCourses,
                });

                // 최근 5개 데이터만 화면에 표시
                setRecentUsers(members.slice(0, 5));
                setRecentCourses(courses.slice(0, 5));
            } catch (error) {
                console.error("대시보드 데이터 로드 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <Box p={4} display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <DashboardStats stats={stats} />

            <DashboardNav
                onNavigateUsers={() => navigate("/admin/users")}
                onNavigateCourses={() => navigate("/admin/courses")}
            />

            <Box display={"flex"} gap={5}>
                <RecentSection
                    title="최근 가입 회원"
                    columns={[
                        { field: "id", headerName: "ID" },
                        { field: "name", headerName: "이름" },
                        { field: "email", headerName: "이메일" },
                        { field: "role", headerName: "역할" },
                    ]}
                    data={recentUsers}
                />

                <RecentSection
                    title="최근 강의"
                    columns={[
                        { field: "course_id", headerName: "ID" },
                        { field: "category", headerName: "카테고리" },
                        { field: "course_name", headerName: "강의명" },
                    ]}
                    data={recentCourses}
                />
            </Box>
        </Box>
    );
}
