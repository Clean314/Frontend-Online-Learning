import React, { useState, useEffect, useRef } from "react";
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
    Dialog,
    DialogTitle,
    DialogContent,
    FormControl,
    InputLabel,
    Select,
    TextField,
    MenuItem,
    DialogActions,
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
import { getCourseInfoAPI, modifyCourseInfoAPI } from "../../../api/course";
import { useParams } from "react-router-dom";
dayjs.locale("ko");

const categories = ["프로그래밍", "데이터베이스", "네트워크", "보안", "AI"];
const difficulties = ["EASY", "MEDIUM", "HARD"];
const credits = [1, 2, 3];

export default function ClassEducatorDashboard() {
    const theme = useTheme();
    const { courseId } = useParams();

    const [courseInfo, setCourseInfo] = useState(null);
    const [currentEnrolled, setCurrentEnrolled] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const data = await getCourseInfoAPI(Number(courseId));
                setCourseInfo({
                    course_id: data.course_id,
                    title: data.course_name,
                    educator_name: data.educator_name,
                    category: data.category,
                    difficulty: data.difficulty,
                    point: data.point,
                    description: data.description,
                    max_enrollment: data.max_enrollment,
                    available_enrollment: data.available_enrollment,
                });
            } catch (err) {
                console.error("강의 정보 조회 실패:", err);
            }
        })();
    }, [courseId]);

    // courseInfo가 설정된 후 currentEnrolled 계산
    useEffect(() => {
        if (courseInfo) {
            setCurrentEnrolled(
                courseInfo.max_enrollment - courseInfo.available_enrollment
            );
        }
    }, [courseInfo]);

    const [stats] = useState({
        avgCompletionRate: 72,
    });

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
                        "&:hover": {
                            bgcolor: theme.palette.primary.dark,
                        },
                    }),
                    ...(isEnd && {
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        borderRadius: 0,
                        "&:hover": {
                            bgcolor: theme.palette.primary.dark,
                        },
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

    const [openEditModal, setOpenEditModal] = useState(false);
    const [formData, setFormData] = useState({
        course_name: "",
        category: "",
        difficulty: "",
        point: "",
        description: "",
        max_enrollment: "",
    });

    const editButtonRef = useRef(null);
    const firstFieldRef = useRef(null);

    const handleOpenEditModal = () => {
        if (!courseInfo) return;

        // 수강생이 한 명이라도 있으면 수정 불가
        if (currentEnrolled > 0) {
            alert("수강 중인 학생이 존재하는 강의는 수정할 수 없습니다.");
            return;
        }

        setFormData({
            course_name: courseInfo.title,
            category: courseInfo.category,
            difficulty: courseInfo.difficulty,
            point: courseInfo.point,
            description: courseInfo.description,
            max_enrollment: courseInfo.max_enrollment,
        });
        setOpenEditModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    };

    const handleAfterModalOpen = () => {
        firstFieldRef.current?.focus?.();
    };

    const handleAfterModalClose = () => {
        editButtonRef.current?.focus?.();
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const parsed = type === "number" ? Number(value) : value;
        setFormData((prev) => ({
            ...prev,
            [name]: parsed,
        }));
    };

    const handleSaveCourseInfo = async (e) => {
        e.preventDefault();
        if (!courseInfo) return;
        try {
            await modifyCourseInfoAPI(courseInfo.course_id, {
                course_name: formData.course_name,
                category: formData.category,
                difficulty: formData.difficulty,
                point: formData.point,
                description: formData.description,
                max_enrollment: formData.max_enrollment,
            });

            setCourseInfo((prev) => ({
                ...prev,
                title: formData.course_name,
                category: formData.category,
                difficulty: formData.difficulty,
                point: formData.point,
                description: formData.description,
                max_enrollment: formData.max_enrollment,
            }));

            setOpenEditModal(false);
            alert("강의 정보가 성공적으로 수정되었습니다.");
        } catch (error) {
            console.error("강의 수정 실패:", error);
            alert("강의 수정에 실패했습니다. 다시 시도해주세요.");
        }
    };

    if (!courseInfo) {
        return <Typography>강의 정보를 불러오는 중입니다...</Typography>;
    }

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
                <Button
                    ref={editButtonRef}
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleOpenEditModal}
                >
                    강의 기본 정보 편집
                </Button>
            </Box>

            {/* 강의 기본 정보 */}
            <Box display="flex" gap={2} mb={3}>
                {[
                    { label: "강사명", value: courseInfo.educator_name },
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
                                {currentEnrolled}명
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                (
                                {Math.round(
                                    (currentEnrolled /
                                        courseInfo.max_enrollment) *
                                        100
                                )}
                                % / 최대 {courseInfo.max_enrollment}명)
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={
                                (currentEnrolled / courseInfo.max_enrollment) *
                                100
                            }
                            sx={{ mt: 1, height: 8, borderRadius: 4 }}
                        />
                    </Box>
                </Box>
                {/* 완료율 평균 */}
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
                            slots={{
                                day: CustomDay,
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

            {/* 강의 기본 정보 편집 모달 */}
            <Dialog
                open={openEditModal}
                onClose={handleCloseEditModal}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    transition: {
                        onEntered: handleAfterModalOpen,
                        onExited: handleAfterModalClose,
                    },
                }}
            >
                <DialogTitle>강의 기본 정보 수정</DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        id="edit-course-form"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mt: 1,
                        }}
                    >
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <FormControl
                                sx={{ width: "30%", minWidth: 120 }}
                                required
                            >
                                <InputLabel>카테고리</InputLabel>
                                <Select
                                    label="카테고리"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    inputRef={firstFieldRef}
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>
                                            {cat}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="강의명"
                                name="course_name"
                                value={formData.course_name}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Box>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <FormControl fullWidth required>
                                <InputLabel>학점</InputLabel>
                                <Select
                                    label="학점"
                                    name="point"
                                    value={formData.point}
                                    onChange={handleChange}
                                >
                                    {credits.map((c) => (
                                        <MenuItem key={c} value={c}>
                                            {c}학점
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth required>
                                <InputLabel>난이도</InputLabel>
                                <Select
                                    label="난이도"
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                >
                                    {difficulties.map((level) => (
                                        <MenuItem key={level} value={level}>
                                            {level}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="최대 수강 인원"
                                name="max_enrollment"
                                type="number"
                                slotProps={{
                                    htmlInput: { min: 10, max: 100 },
                                }}
                                value={formData.max_enrollment}
                                onChange={handleChange}
                                fullWidth
                                required
                                helperText="최소 10명, 최대 100명까지 입력 가능합니다."
                            />
                        </Box>

                        <TextField
                            label="상세 설명"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseEditModal}>취소</Button>
                    <Button
                        type="submit"
                        form="edit-course-form"
                        variant="contained"
                        onClick={handleSaveCourseInfo}
                    >
                        저장
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
