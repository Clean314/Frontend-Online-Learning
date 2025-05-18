import * as React from "react";
import { createTheme, styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SchoolIcon from "@mui/icons-material/School";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Grid from "@mui/material/Grid";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

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
        { kind: "header", title: "강사 메뉴" },
        { segment: "dashboard", title: "대시보드", icon: <DashboardIcon /> },
        {
            segment: "course/register",
            title: "강의 등록",
            icon: <PlaylistAddIcon />,
        },
        {
            segment: "myCourses",
            title: "내 강의 목록",
            icon: <AssignmentIcon />,
        },
    ],
    STUDENT: [
        { kind: "header", title: "학생 메뉴" },
        { segment: "dashboard", title: "대시보드", icon: <DashboardIcon /> },
        {
            segment: "course/list",
            title: "전체 강의 보기",
            icon: <LibraryBooksIcon />,
        },
        {
            segment: "enrolledList",
            title: "내 수강 강의",
            icon: <SchoolIcon />,
        },
    ],
};

const demoTheme = createTheme({
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

function useDemoRouter(initialPath) {
    const [pathname, setPathname] = React.useState(initialPath);

    const router = React.useMemo(() => {
        return {
            pathname,
            searchParams: new URLSearchParams(),
            navigate: (path) => setPathname(String(path)),
        };
    }, [pathname]);

    return router;
}

const Skeleton = styled("div")(({ theme, height }) => ({
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
    height,
    content: '" "',
}));

export default function DashboardLayoutBasic(props) {
    const { window } = props;

    const router = useDemoRouter("/dashboard");

    const demoWindow = window ? window() : undefined;

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    // 로그아웃
    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (err) {
            console.log(err);
            alert("로그아웃 실패: " + err.message);
        }
    };

    // 사용자 role에 따른 메뉴 설정
    const role = user?.role;
    const NAVIGATION = navigationByRole[role] || [];

    return (
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={demoTheme}
            window={demoWindow}
            branding={{
                logo: <img src="/logo.png" alt="LMS logo" />,
                title: "LMS",
                homeUrl: "/",
            }}
        >
            <DashboardLayout>
                {/* 상단 툴바 */}
                <AppBar position="static" color="default" elevation={0}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            {user?.role} {user?.name || "사용자"}
                        </Typography>
                        {user && (
                            <Button
                                color="primary"
                                variant="outlined"
                                onClick={handleLogout}
                            >
                                로그아웃
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>

                <PageContainer>
                    <Grid container spacing={1}>
                        <Grid size={5} />
                        <Grid size={12}>
                            <Skeleton height={14} />
                        </Grid>
                        <Grid size={12}>
                            <Skeleton height={14} />
                        </Grid>
                        <Grid size={4}>
                            <Skeleton height={100} />
                        </Grid>
                        <Grid size={8}>
                            <Skeleton height={100} />
                        </Grid>

                        <Grid size={12}>
                            <Skeleton height={150} />
                        </Grid>
                        <Grid size={12}>
                            <Skeleton height={14} />
                        </Grid>

                        <Grid size={3}>
                            <Skeleton height={100} />
                        </Grid>
                        <Grid size={3}>
                            <Skeleton height={100} />
                        </Grid>
                        <Grid size={3}>
                            <Skeleton height={100} />
                        </Grid>
                        <Grid size={3}>
                            <Skeleton height={100} />
                        </Grid>
                    </Grid>
                </PageContainer>
            </DashboardLayout>
        </AppProvider>
    );
}
