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
import { ColorModeContext } from "../ColorModeContext";
import { useContext, useMemo } from "react";
import SidebarFooter from "./components/SidebarFooter";
import { useTheme } from "@emotion/react";
import { Box, IconButton } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import GroupIcon from "@mui/icons-material/Group";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const navigationByRole = {
    ADMIN: [
        { kind: "header", title: "ADMIN" },
        {
            segment: "admin/dashboard",
            title: "대시보드",
            icon: <DashboardIcon />,
        },
        { segment: "admin/users", title: "사용자 관리", icon: <GroupIcon /> },
        {
            segment: "admin/courses",
            title: "강의 관리",
            icon: <MenuBookIcon />,
        },
    ],
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
            segment: "courses",
            title: "전체 강의 보기",
            icon: <LibraryBooksIcon />,
        },
        {
            segment: "learn/myCourses",
            title: "내 수강 강의",
            icon: <SchoolIcon />,
            children: [
                {
                    segment: "total",
                    title: "전체 수강 내역",
                },
                {
                    segment: "enrolled",
                    title: "수강 중인 강의",
                },
                {
                    segment: "completed",
                    title: "수강 완료 강의",
                },
            ],
        },
    ],
};

export default function MainPage(props) {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

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
            theme={theme}
            window={props.window ? window() : undefined}
            branding={{
                logo: <img src="/logo.png" alt="LMS logo" />,
                title: "LMS",
                homeUrl: "/",
            }}
        >
            <DashboardLayout
                slots={{ sidebarFooter: SidebarFooter }}
                slotProps={{
                    sidebarFooter: ({ mini }) => ({ mini }),
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 16,
                        zIndex: 1300,
                    }}
                >
                    <IconButton
                        onClick={colorMode.toggleColorMode}
                        color="inherit"
                    >
                        {theme.palette.mode === "dark" ? (
                            <LightModeIcon />
                        ) : (
                            <DarkModeIcon />
                        )}
                    </IconButton>
                </Box>
                <PageContainer>
                    <Outlet />
                </PageContainer>
            </DashboardLayout>
        </AppProvider>
    );
}
