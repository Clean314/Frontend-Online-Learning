import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/auth/useAuth";
import { ColorModeContext } from "../ColorModeContext";
import { useContext, useMemo } from "react";
import SidebarFooter from "./components/SidebarFooter";
import { useTheme } from "@emotion/react";
import { Box, IconButton, Typography } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HomeIcon from "@mui/icons-material/Home";

const getNavigationByRole = (role) => {
    return (
        {
            EDUCATOR: [
                { kind: "header", title: "EDUCATOR - 강의실" },
                {
                    title: "대시보드",
                    icon: <DashboardIcon />,
                    segment: `teach/dashboard`,
                },
                {
                    title: "강의 영상",
                    icon: <VideoLibraryIcon />,
                    segment: `teach/videos`,
                },
                {
                    title: "출결",
                    icon: <EventAvailableIcon />,
                    segment: `teach/attendance`,
                },
                {
                    title: "시험",
                    icon: <AssignmentIcon />,
                    segment: `teach/exams`,
                },
            ],
            STUDENT: [
                { kind: "header", title: "STUDENT - 강의실" },
                {
                    title: "대시보드",
                    icon: <DashboardIcon />,
                    segment: `learn/dashboard`,
                },
                {
                    title: "강의 영상",
                    icon: <VideoLibraryIcon />,
                    segment: `learn/videos`,
                },
                {
                    title: "출결",
                    icon: <EventAvailableIcon />,
                    segment: `learn/attendance`,
                },
                {
                    title: "시험",
                    icon: <AssignmentIcon />,
                    segment: `learn/exams`,
                },
            ],
        }[role] || []
    );
};

export default function MainPage(props) {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    const { user } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const { courseId } = useParams();

    const base = `/courses/${courseId}/classroom`;

    // 사용자 role에 따른 메뉴 설정
    const NAVIGATION = getNavigationByRole(user?.role);

    // ② AppProvider에 넘길 router 객체
    const router = useMemo(() => {
        // 현재 URL에서 base 부분을 떼고 나머지만 AppProvider에 넘김
        let path = location.pathname;
        if (path.startsWith(base)) {
            path = path.slice(base.length);
        }
        if (!path || path === "") path = "/";

        return {
            pathname: path, // ex. "/teach/dashboard"
            searchParams: new URLSearchParams(location.search),
            // AppProvider 내부 navigate("teach/videos") 호출 시
            // 실제 이동은 base + "/teach/videos"
            navigate: (relPath) => {
                const seg = relPath.startsWith("/") ? relPath : `/${relPath}`;
                navigate(base + seg);
            },
        };
    }, [location, navigate, courseId]);

    return (
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={theme}
            window={props.window ? window() : undefined}
            branding={{
                logo: <></>,
                title: "",
                homeUrl: "",
            }}
        >
            <DashboardLayout
                slots={{ sidebarFooter: SidebarFooter }}
                slotProps={{
                    sidebarFooter: ({ mini }) => ({ mini }),
                }}
            >
                {/* 사이드바 상단 홈 버튼 */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 8,
                        left: 50,
                        zIndex: 1300,
                    }}
                >
                    <IconButton onClick={() => navigate("/")} color="inherit">
                        <HomeIcon
                            sx={{
                                fontSize: 33,
                                color: theme.palette.primary.main,
                                mr: 1,
                            }}
                        />
                        <Typography
                            variant="h5"
                            color={theme.palette.primary.main}
                        >
                            HOME
                        </Typography>
                    </IconButton>
                </Box>

                {/* 우측 상단 다크모드 버튼 */}
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
