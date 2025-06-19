import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Card,
    LinearProgress,
    CircularProgress,
    Divider,
    ListItemText,
    List,
    ListItem,
    Chip,
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
import { getStudentExamListAPI } from "../../../api/exam";
import { fetchAverageAttendanceAPI } from "../../../api/lectureHistory";
import { useParams } from "react-router-dom";
import { getMyEnrolledCourseByIdAPI } from "../../../api/enrollment";
dayjs.locale("ko");

export default function ClassStudentDashboard() {
    const theme = useTheme();
    const { courseId } = useParams();

    const [course, setCourse] = useState(null); // 강의 기본 정보
    const [lectureEvents, setLectureEvents] = useState([]); // 시험 일정
    const [myProgressRate, setMyProgressRate] = useState(null); // 내 강의 진행률

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const today = dayjs();

    // 강의 기본 정보 조회
    useEffect(() => {
        const loadCourse = async () => {
            try {
                const result = await getMyEnrolledCourseByIdAPI(
                    Number(courseId)
                );
                setCourse(result);
            } catch (err) {
                console.error("강의 정보 조회 실패:", err);
                setError("강의 정보를 불러오는 중 오류가 발생했습니다.");
            }
        };

        if (courseId) loadCourse();
    }, [courseId]);

    // 시험 일정 데이터 불러오기
    useEffect(() => {
        const loadExams = async () => {
            try {
                const data = await getStudentExamListAPI(courseId);
                const transformed = data.map((exam) => ({
                    start: new Date(exam.start_time),
                    end: new Date(exam.end_time),
                    label: exam.title,
                }));
                setLectureEvents(transformed);
            } catch (err) {
                console.error("시험 일정 불러오기 실패:", err);
                setError("시험 일정을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        loadExams();
    }, [courseId]);

    // 시험 일정 로딩 끝난 후 출석률 요청
    useEffect(() => {
        const loadAttendance = async () => {
            try {
                const result = await fetchAverageAttendanceAPI(courseId);

                setMyProgressRate(Number(result.toFixed(1)));
            } catch (err) {
                console.error("출석률 조회 실패:", err);
            }
        };

        loadAttendance();
    }, [courseId]);

    // 다음 시험 자동 선택
    const upcoming = lectureEvents
        .filter((e) => dayjs(e.end).isAfter(today, "minute"))
        .sort((a, b) => dayjs(a.start).diff(dayjs(b.start)));
    const nextExam = upcoming[0] || null;

    // D-Day 계산
    const daysUntilNextExam = nextExam
        ? dayjs(nextExam.start).diff(today, "day")
        : null;

    // 캘린더 상태
    const [selectedDate, setSelectedDate] = useState(today);
    const [viewDate, setViewDate] = useState(today);

    // 이번 달 이벤트
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

    if (loading || !course) {
        return (
            <Paper sx={{ p: 3 }}>
                <Box textAlign="center" py={5}>
                    <CircularProgress />
                </Box>
            </Paper>
        );
    }
    if (error) {
        return (
            <Paper sx={{ p: 3 }}>
                <Box textAlign="center" py={5}>
                    <Typography color="error">{error}</Typography>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3 }}>
            {/* 헤더 */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ borderBottom: 1, borderColor: "divider", pb: 1, mb: 3 }}
            >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {course.course_name}
                </Typography>
            </Box>

            {/* 기본 정보 */}
            <Box display="flex" gap={2} mb={3}>
                {[
                    { label: "강사명", value: course.educator_name },
                    { label: "카테고리", value: course.category },
                    { label: "난이도", value: course.difficulty },
                ].map((item) => (
                    <Box
                        key={item.label}
                        sx={{
                            flex: 1,
                            bgcolor: theme.palette.grey[100],
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

            {/* 소개 */}
            <Typography variant="body1" color="text.secondary" mb={4}>
                {course.description}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {/* 진행률 */}
            <Box display="flex" gap={10} mb={5}>
                {/* 다음 시험 D-Day + 정보 */}
                <Box
                    sx={{ flex: 1 }}
                    display="flex"
                    gap={4}
                    alignItems="center"
                >
                    <ScheduleIcon sx={{ fontSize: 40, flex: 1 }} />
                    <Box sx={{ flex: 3 }}>
                        <Typography variant="overline">
                            다음 시험까지
                        </Typography>
                        <Typography variant="h6">
                            {daysUntilNextExam == null
                                ? "-"
                                : daysUntilNextExam === 0
                                  ? "D-day"
                                  : `D-${daysUntilNextExam}`}
                        </Typography>
                        {nextExam && (
                            <Chip
                                label={`${nextExam.label} ${dayjs(
                                    nextExam.start
                                ).format("MM월 DD일 HH:mm")}`}
                                size="small"
                                sx={{
                                    mt: 0.5,
                                    bgcolor: "#B2EBF2",
                                    color: "#004D40",
                                    fontWeight: 500,
                                }}
                            />
                        )}
                    </Box>
                </Box>
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
                            {myProgressRate !== null
                                ? `${myProgressRate}%`
                                : "0%"}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={myProgressRate || 0}
                            sx={{ mt: 1, height: 8, borderRadius: 4 }}
                        />
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* 일정 캘린더 */}
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
                            displayStaticWrapperAs="desktop"
                            value={selectedDate}
                            onChange={(newDate) => setSelectedDate(newDate)}
                            onMonthChange={(newView) => setViewDate(newView)}
                            slots={{ day: CustomDay }}
                            slotProps={{
                                actionBar: { actions: [] },
                                day: {
                                    sx: { "--PickersDay-daySpacing": "0px" },
                                },
                            }}
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
                                                        ? `${dayjs(start).format("MM월 DD일 (ddd)")} — ${label}`
                                                        : `${dayjs(start).format("MM월 DD일 (ddd)")} ~ ${dayjs(end).format("MM월 DD일 (ddd)")} — ${label}`
                                                }
                                            />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        ) : (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                mt={2}
                            >
                                해당 월에 일정이 없습니다.
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Card>
        </Paper>
    );
}
