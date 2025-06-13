import { Card, CardContent, Stack, Typography, Box } from "@mui/material";

/**
 * 관리자 대시보드 통계 카드
 * @param {Object} props
 * @param {import('react').ReactNode} props.icon - 카드에 표시할 아이콘
 * @param {string} props.title - 통계 제목
 * @param {number|string} props.value - 통계 값
 */
export default function StatCard({ icon, title, value }) {
    return (
        <Card elevation={3}>
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                    {icon}
                    <Box>
                        <Typography variant="subtitle1" color="textSecondary">
                            {title}
                        </Typography>
                        <Typography variant="h4">{value}</Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}
