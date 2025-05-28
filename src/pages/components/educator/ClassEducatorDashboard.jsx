// src/pages/components/educator/ClassEducatorDashboard.jsx
import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    Card,
    LinearProgress,
    Divider,
    ListItemText,
    List,
    ListItem,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { alpha, styled, useTheme } from "@mui/material/styles";
import {
    LocalizationProvider,
    PickersDay,
    StaticDatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ko";
import dayjs from "dayjs";
import PeopleIcon from "@mui/icons-material/People";
import ShowChartIcon from "@mui/icons-material/ShowChart";
dayjs.locale("ko");

// 강사 대시보드 페이지
export default function ClassEducatorDashboard() {
    const theme = useTheme();

    // 강의 기본 정보 (임시 데이터)
    const [courseInfo] = useState({
        course_id: 1,
        title: "React 기초부터 심화까지",
        instructor: "홍길동",
        category: "프로그래밍",
        difficulty: "중급",
        description:
            "이 강의는 React의 기초 문법부터 고급 Hooks 사용법까지 다룹니다.",
        max_enrollment: 40,
    });

    // 수강생 총괄 현황 (임시 데이터)
    const [stats] = useState({
        studentCount: 25,
        avgCompletionRate: 72,
    });

    // 강의 일정 캘린더 상태
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [viewDate, setViewDate] = useState(dayjs());

    const lectureEvents = [
        {
            start: new Date(2025, 4, 20),
            end: new Date(2025, 4, 20),
            label: "개강",
        },
        {
            start: new Date(2025, 4, 27),
            end: new Date(2025, 5, 3),
            label: "중간고사",
        },
        {
            start: new Date(2025, 5, 10),
            end: new Date(2025, 5, 17),
            label: "기말고사",
        },
        {
            start: new Date(2025, 6, 30),
            end: new Date(2025, 6, 30),
            label: "종강",
        },
    ];

    // LectureEvents 정의 아래에 추가
    const startEvent = lectureEvents.find((e) => e.label === "개강");
    const endEvent = lectureEvents.find((e) => e.label === "종강");

    // 현재 보이는 월의 1일~말일 구하기
    const monthStart = dayjs(viewDate).startOf("month");
    const monthEnd = dayjs(viewDate).endOf("month");

    // start~end 범위 기준으로 연·월에 맞는 이벤트 필터링
    const monthEvents = lectureEvents.filter(
        ({ start, end }) =>
            // 이벤트 기간이 보이는 월과 한 칸이라도 겹치면 포함
            dayjs(start).isBefore(monthEnd, "day") &&
            dayjs(end).isAfter(monthStart, "day")
    );

    // PickersDay를 상속해 하이라이트 스타일 정의
    const HighlightedDay = styled(PickersDay)(({ theme }) => ({
        "&.Mui-selected, &.MuiPickersDay-root[event-day]": {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
        },
    }));

    // slots.day에 사용할 커스텀 컴포넌트
    function CustomDay(props) {
        const { day, outsideCurrentMonth, ...other } = props;

        // 오늘인지 체크
        const isToday = day.isSame(dayjs(), "day");

        // 각 이벤트별로 start/end/in-between 체크
        let isStart = false;
        let isEnd = false;
        let isBetween = false;

        lectureEvents.forEach(({ start, end }) => {
            if (day.isSame(dayjs(start), "day")) isStart = true;
            else if (day.isSame(dayjs(end), "day")) isEnd = true;
            else if (
                day.isAfter(dayjs(start), "day") &&
                day.isBefore(dayjs(end), "day")
            )
                isBetween = true;
        });

        return (
            <PickersDay
                {...other}
                day={day}
                outsideCurrentMonth={outsideCurrentMonth}
                sx={{
                    // 공통으로 좌우 마진 제거
                    mr: 0,
                    ml: 0,
                    // 시작일: 진한 배경
                    ...(isStart && {
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        borderRadius: 0,
                        "&:hover": {
                            bgcolor: theme.palette.primary.dark,
                        },
                    }),
                    // 종료일: 진한 배경
                    ...(isEnd && {
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        borderRadius: 0,
                        "&:hover": {
                            bgcolor: theme.palette.primary.dark,
                        },
                    }),
                    // 사이 구간: 연한 배경
                    ...(isBetween && {
                        bgcolor: alpha(theme.palette.primary.main, 0.3),
                        borderRadius: 0,
                    }),
                    // 오늘 날짜에는 굵은 테두리
                    ...(isToday && {
                        border: `2px solid ${theme.palette.primary.dark}`,
                        padding: "0.25rem",
                    }),
                }}
            />
        );
    }

    useEffect(() => {
        // TODO: API 연동 후 courseInfo, stats, lectureEvents 업데이트
    }, []);

    return (
        <Paper sx={{ p: 3 }}>
            {/* 상단 헤더 */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ borderBottom: 1, borderColor: "divider", pb: 1, mb: 3 }}
            >
                <Box display={"flex"} gap={1} alignItems={"flex-end"}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {courseInfo.title}
                    </Typography>
                    {startEvent && endEvent && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 1, verticalAlign: "middle" }}
                        >
                            {dayjs(startEvent.start).format("YYYY.MM.DD")} ~
                            {dayjs(endEvent.end).format("YYYY.MM.DD")}
                        </Typography>
                    )}
                </Box>
                <Button variant="outlined" startIcon={<EditIcon />}>
                    강의 기본 정보 편집
                </Button>
            </Box>

            {/* 강의 기본 정보 */}
            <Box display="flex" gap={2} mb={3}>
                {[
                    { label: "강사명", value: courseInfo.instructor },
                    { label: "카테고리", value: courseInfo.category },
                    { label: "난이도", value: courseInfo.difficulty },
                ].map((item) => (
                    <Box
                        key={item.label}
                        sx={{
                            flex: 1,
                            bgcolor:
                                theme.palette.mode === "dark"
                                    ? theme.palette.grey[800]
                                    : theme.palette.grey[100],
                            p: 2,
                            borderRadius: 1,
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            variant="overline"
                            display="block"
                            gutterBottom
                        >
                            {item.label}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 500 }}
                        >
                            {item.value}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* 강의 소개 */}
            <Typography variant="body1" color="text.secondary" mb={4}>
                {courseInfo.description}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {/* 수강생 총괄 현황 */}
            <Box display="flex" gap={10} mb={5}>
                {/* 수강자 수 */}
                <Box
                    sx={{ flex: 1 }}
                    display={"flex"}
                    gap={4}
                    alignItems={"center"}
                >
                    <PeopleIcon sx={{ fontSize: 40, flex: 1 }} />
                    <Box sx={{ flex: 3 }}>
                        <Typography variant="overline">수강자 수</Typography>
                        <Box display={"flex"} alignItems={"flex-end"} gap={2}>
                            <Typography variant="h6">
                                {stats.studentCount}명
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                (
                                {Math.round(
                                    (stats.studentCount /
                                        courseInfo.max_enrollment) *
                                        100
                                )}
                                % / 최대 {courseInfo.max_enrollment}명)
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={
                                (stats.studentCount /
                                    courseInfo.max_enrollment) *
                                100
                            }
                            sx={{ mt: 1, height: 8, borderRadius: 4 }}
                        />
                    </Box>
                </Box>
                {/* 완료율 평균 시각화 */}
                <Box
                    sx={{ flex: 1 }}
                    display={"flex"}
                    gap={4}
                    alignItems={"center"}
                >
                    <ShowChartIcon sx={{ fontSize: 40, flex: 1 }} />
                    <Box sx={{ flex: 3 }}>
                        <Typography variant="overline">완료율 평균</Typography>
                        <Typography variant="h6">
                            {stats.avgCompletionRate}%
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={stats.avgCompletionRate}
                            sx={{ mt: 1, height: 8, borderRadius: 4 }}
                        />
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* 강의 일정 캘린더 */}
            <Card elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    강의 일정
                </Typography>

                <Box display="flex" gap={4}>
                    {/* 1) 좌측: 캘린더 */}
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="ko"
                    >
                        <StaticDatePicker
                            slotProps={{
                                // 하단 Cancel/OK 버튼 제거
                                actionBar: { actions: [] },
                                // day마다 스페이싱 0으로 셋팅
                                day: {
                                    sx: { "--PickersDay-daySpacing": "0px" },
                                },
                            }}
                            displayStaticWrapperAs="desktop"
                            value={selectedDate}
                            onChange={(newDate) => setSelectedDate(newDate)}
                            // 달 네비게이션 시 viewDate 업데이트
                            onMonthChange={(newView) => setViewDate(newView)}
                            // slots.day에 CustomDay 등록
                            slots={{
                                day: CustomDay,
                            }}
                            sx={{ "--PickersDay-daySpacing": "0px" }}
                        />
                    </LocalizationProvider>

                    {/* 2) 우측: 해당 월 강의 일정 리스트 */}
                    <Box sx={{ minWidth: 160 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            {viewDate.format("YYYY년 M월")} 일정
                        </Typography>
                        {monthEvents.length > 0 ? (
                            <List dense>
                                {monthEvents.map(({ start, end, label }) => {
                                    const sameDay = dayjs(start).isSame(
                                        dayjs(end),
                                        "day"
                                    );
                                    return (
                                        <ListItem
                                            key={label + start.toISOString()}
                                            disablePadding
                                        >
                                            <ListItemText
                                                primary={
                                                    sameDay
                                                        ? `${dayjs(start).format("MM월 DD일 (ddd)")} — ${label}`
                                                        : `${dayjs(start).format("MM월 DD일 (ddd)")} ~ ${dayjs(end).format("MM월 DD일 (ddd)")} — ${label}`
                                                }
                                            />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                해당 월에 일정이 없습니다.
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Card>
        </Paper>
    );
}
