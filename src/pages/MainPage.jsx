import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SchoolIcon from "@mui/icons-material/School";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/auth/useAuth";
import { useMemo } from "react";
import SidebarFooter from "./components/SidebarFooter";

const navigationByRole = {
    // ADMIN: [
    //     { kind: "header", title: "관리자 메뉴" },
    //     { segment: "dashboard", title: "대시보드", icon: <DashboardIcon /> },
    //     { segment: "manage/user", title: "사용자 관리", icon: <GroupIcon /> },
    //     {
    //         segment: "manage/course",
    //         title: "강의 관리",
    //         icon: <MenuBookIcon />,
    //     },
    // ],
    EDUCATOR: [
        { kind: "header", title: "EDUCATOR" },
        { segment: "dashboard", title: "대시보드", icon: <DashboardIcon /> },
        {
            segment: "teach/newCourse",
            title: "강의 등록",
            icon: <PlaylistAddIcon />,
        },
        {
            segment: "teach/myCourses",
            title: "내 강의 목록",
            icon: <AssignmentIcon />,
        },
    ],
    STUDENT: [
        { kind: "header", title: "STUDENT" },
        { segment: "dashboard", title: "대시보드", icon: <DashboardIcon /> },
        {
            segment: "learn/courses",
            title: "전체 강의 보기",
            icon: <LibraryBooksIcon />,
        },
        {
            segment: "learn/myCourses",
            title: "내 수강 강의",
            icon: <SchoolIcon />,
            children: [
                {
                    segment: "learn/myCourses/total",
                    title: "전체 수강 내역",
                },
                {
                    segment: "learn/myCourses/enrolled",
                    title: "수강 중인 강의",
                },
                {
                    segment: "learn/myCourses/completed",
                    title: "수강 완료 강의",
                },
            ],
        },
    ],
};

const myTheme = createTheme({
    colorSchemes: { light: true, dark: true },
    cssVariables: {
        colorSchemeSelector: "class",
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

export default function MainPage(props) {
    const { window } = props;

    const { user } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    // 사용자 role에 따른 메뉴 설정
    const role = user?.role;
    const NAVIGATION = navigationByRole[role] || [];

    // react Router와 동기화된 router 객체
    const router = useMemo(
        () => ({
            pathname: location.pathname,
            searchParams: new URLSearchParams(location.search),
            navigate: (path) => navigate(path),
        }),
        [location, navigate]
    );

    return (
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={myTheme}
            window={window ? window() : undefined}
            branding={{
                logo: <img src="/logo.png" alt="LMS logo" />,
                title: "LMS",
                homeUrl: "/",
            }}
        >
            <DashboardLayout
                slots={{ sidebarFooter: SidebarFooter }}
                slotProps={{ sidebarFooter: { mini: false } }}
            >
                <PageContainer>
                    <Outlet />
                </PageContainer>
            </DashboardLayout>
        </AppProvider>
    );
}
