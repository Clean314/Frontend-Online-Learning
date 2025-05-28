import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Card,
    LinearProgress,
    Divider,
    ListItemText,
    List,
    ListItem,
} from "@mui/material";
import { alpha, styled, useTheme } from "@mui/material/styles";
import {
    LocalizationProvider,
    PickersDay,
    StaticDatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ko";
import dayjs from "dayjs";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ShowChartIcon from "@mui/icons-material/ShowChart";
dayjs.locale("ko");

export default function ClassStudentDashboard() {
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
    });

    // 남은 수강일 & 내 진행률 (임시 데이터)
    const [stats] = useState({
        remainingDays: 30, // TODO: API 연동 후 실제 남은 일수로 대체
        myProgressRate: 45, // TODO: API 연동 후 실제 내 진행률로 대체 (%)
    });

    // 강의 일정 캘린더 상태
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [viewDate, setViewDate] = useState(dayjs());

    // TODO: API 연동 후 courseInfo, stats, lectureEvents 업데이트
    useEffect(() => {}, []);

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
    const startEvent = lectureEvents.find((e) => e.label === "개강");
    const endEvent = lectureEvents.find((e) => e.label === "종강");

    const monthStart = dayjs(viewDate).startOf("month");
    const monthEnd = dayjs(viewDate).endOf("month");
    const monthEvents = lectureEvents.filter(
        ({ start, end }) =>
            dayjs(start).isBefore(monthEnd, "day") &&
            dayjs(end).isAfter(monthStart, "day")
    );

    const HighlightedDay = styled(PickersDay)(({ theme }) => ({
        "&.Mui-selected, &.MuiPickersDay-root[event-day]": {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
        },
    }));

    function CustomDay(props) {
        const { day, outsideCurrentMonth, ...other } = props;
        const isToday = day.isSame(dayjs(), "day");
        let isStart = false,
            isEnd = false,
            isBetween = false;

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
                    mr: 0,
                    ml: 0,
                    ...(isStart && {
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        borderRadius: 0,
                        "&:hover": { bgcolor: theme.palette.primary.dark },
                    }),
                    ...(isEnd && {
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        borderRadius: 0,
                        "&:hover": { bgcolor: theme.palette.primary.dark },
                    }),
                    ...(isBetween && {
                        bgcolor: alpha(theme.palette.primary.main, 0.3),
                        borderRadius: 0,
                    }),
                    ...(isToday && {
                        border: `2px solid ${theme.palette.primary.dark}`,
                        padding: "0.25rem",
                    }),
                }}
            />
        );
    }

    return (
        <Paper sx={{ p: 3 }}>
            {/* 상단 헤더 (편집 버튼 제거) */}
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

            {/* 남은 수강일 & 내 진행률 */}
            <Box display="flex" gap={10} mb={5}>
                {/* 남은 수강일 */}
                <Box
                    sx={{ flex: 1 }}
                    display="flex"
                    gap={4}
                    alignItems="center"
                >
                    <ScheduleIcon sx={{ fontSize: 40, flex: 1 }} />
                    <Box sx={{ flex: 3 }}>
                        <Typography variant="overline">남은 수강일</Typography>
                        <Typography variant="h6">
                            {stats.remainingDays}일
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={Math.max(0, stats.remainingDays)}
                            sx={{ mt: 1, height: 8, borderRadius: 4 }}
                        />
                    </Box>
                </Box>
                {/* 내 강의 진행률 */}
                <Box
                    sx={{ flex: 1 }}
                    display="flex"
                    gap={4}
                    alignItems="center"
                >
                    <ShowChartIcon sx={{ fontSize: 40, flex: 1 }} />
                    <Box sx={{ flex: 3 }}>
                        <Typography variant="overline">
                            내 강의 진행률
                        </Typography>
                        <Typography variant="h6">
                            {stats.myProgressRate}%
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={stats.myProgressRate}
                            sx={{ mt: 1, height: 8, borderRadius: 4 }}
                        />
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* 강의 일정 캘린더 (기존 코드 유지) */}
            <Card elevation={1} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    강의 일정
                </Typography>
                <Box display="flex" gap={4}>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="ko"
                    >
                        <StaticDatePicker
                            slotProps={{
                                actionBar: { actions: [] },
                                day: {
                                    sx: { "--PickersDay-daySpacing": "0px" },
                                },
                            }}
                            displayStaticWrapperAs="desktop"
                            value={selectedDate}
                            onChange={(newDate) => setSelectedDate(newDate)}
                            onMonthChange={(newView) => setViewDate(newView)}
                            slots={{ day: CustomDay }}
                            sx={{ "--PickersDay-daySpacing": "0px" }}
                        />
                    </LocalizationProvider>
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
                                                        ? `${dayjs(
                                                              start
                                                          ).format(
                                                              "MM월 DD일 (ddd)"
                                                          )} — ${label}`
                                                        : `${dayjs(
                                                              start
                                                          ).format(
                                                              "MM월 DD일 (ddd)"
                                                          )} ~ ${dayjs(
                                                              end
                                                          ).format(
                                                              "MM월 DD일 (ddd)"
                                                          )} — ${label}`
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
