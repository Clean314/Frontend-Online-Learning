import DashboardIcon from "@mui/icons-material/Dashboard";
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
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const navigationByRole = {
    EDUCATOR: [
        { kind: "header", title: "EDUCATOR" },
        {
            title: "대시보드",
            icon: <DashboardIcon />,
            segment: `./teach/dashboard`,
        },
        {
            title: "강의 영상",
            icon: <VideoLibraryIcon />,
            segment: `./teach/videos`,
        },
        {
            title: "출결",
            icon: <EventAvailableIcon />,
            segment: `./teach/attendance`,
        },
        {
            title: "시험",
            icon: <AssignmentIcon />,
            segment: `./teach/exams`,
        },
    ],
    STUDENT: [
        { kind: "header", title: "STUDENT" },
        {
            title: "대시보드",
            icon: <DashboardIcon />,
            segment: `./learn/dashboard`,
        },
        {
            title: "강의 영상",
            icon: <VideoLibraryIcon />,
            segment: `./learn/videos`,
        },
        {
            title: "출결",
            icon: <EventAvailableIcon />,
            segment: `./learn/attendance`,
        },
        {
            title: "시험",
            icon: <AssignmentIcon />,
            segment: `./learn/exams`,
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
                title: "EduON",
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
