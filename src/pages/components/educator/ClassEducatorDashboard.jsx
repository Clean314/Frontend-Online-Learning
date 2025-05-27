import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";

export default function ClassEducatorDashboard() {
    const [stats, setStats] = useState({
        studentCount: 10, // 임시 데이터: 총 수강생 수
        avgProgress: 65, // 임시 데이터: 평균 진행률
        completedExams: 2, // 임시 데이터: 완료된 시험 개수
        upcomingUploads: 1, // 임시 데이터: 업로드 예정 강의 수
    });

    useEffect(() => {
        // TODO: 실제 API 연동 후 대시보드 통계 데이터 불러오기
        // 예: getEducatorDashboardAPI(courseId).then(data => setStats(data));
    }, []);

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                강사 대시보드
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6">총 수강생 수</Typography>
                            <Typography variant="h3">
                                {stats.studentCount}명
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6">평균 진행률</Typography>
                            <Typography variant="h3">
                                {stats.avgProgress}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6">완료된 시험</Typography>
                            <Typography variant="h3">
                                {stats.completedExams}개
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h6">
                                업로드 예정 강의
                            </Typography>
                            <Typography variant="h3">
                                {stats.upcomingUploads}개
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
