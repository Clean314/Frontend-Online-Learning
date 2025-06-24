import {
    Box,
    Typography,
    Card,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import {
    LocalizationProvider,
    PickersDay,
    StaticDatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { alpha, useTheme } from "@mui/material/styles";

/**
 * 강의 일정 캘린더 및 월별 일정 리스트 표시 컴포넌트
 *
 * @param lectureEvents -- 시험/강의 일정 배열 [{ start, end, label }]
 * @param selectedDate -- 현재 선택된 날짜 (dayjs 객체)
 * @param setSelectedDate -- 날짜 선택 시 상태 업데이트 함수
 * @param viewDate -- 현재 보고 있는 달 (dayjs 객체)
 * @param setViewDate -- 달 변경 시 상태 업데이트 함수
 */
export default function CourseCalendar({
    lectureEvents,
    selectedDate,
    setSelectedDate,
    viewDate,
    setViewDate,
}) {
    const theme = useTheme();

    // 이번 달 안에 포함되는 일정만 필터링
    const monthStart = dayjs(viewDate).startOf("month");
    const monthEnd = dayjs(viewDate).endOf("month");
    const monthEvents = lectureEvents.filter(
        ({ start, end }) =>
            dayjs(start).isBefore(monthEnd, "day") &&
            dayjs(end).isAfter(monthStart, "day")
    );

    // 각 날짜마다 일정에 해당하는 스타일 지정
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
                        onChange={setSelectedDate}
                        onMonthChange={setViewDate}
                        slots={{ day: CustomDay }}
                        sx={{ "--PickersDay-daySpacing": "0px" }}
                    />
                </LocalizationProvider>

                {/* 월별 일정 리스트 */}
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
                                                    ? `${dayjs(start).format(
                                                          "MM월 DD일 (ddd)"
                                                      )} — ${label}`
                                                    : `${dayjs(start).format(
                                                          "MM월 DD일 (ddd)"
                                                      )} ~ ${dayjs(end).format(
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
    );
}
