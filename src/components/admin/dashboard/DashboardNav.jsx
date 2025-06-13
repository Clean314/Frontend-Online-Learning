import { Box, Stack, Button } from "@mui/material";

/**
 * 대시보드 네비게이션 버튼
 * @param {Object} props
 * @param {function} props.onNavigateUsers - 회원 관리 페이지 이동 핸들러
 * @param {function} props.onNavigateCourses - 강의 관리 페이지 이동 핸들러
 */
export default function DashboardNav({ onNavigateUsers, onNavigateCourses }) {
    return (
        <Box mt={4}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button variant="contained" onClick={onNavigateUsers}>
                    회원 관리
                </Button>
                <Button variant="contained" onClick={onNavigateCourses}>
                    강의 관리
                </Button>
            </Stack>
        </Box>
    );
}
