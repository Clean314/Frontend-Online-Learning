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
import { modifyCourseInfoAPI } from "../../../api/course";
dayjs.locale("ko");

const categories = ["프로그래밍", "데이터베이스", "네트워크", "보안", "AI"];
const difficulties = ["EASY", "MEDIUM", "HARD"];
const credits = [1, 2, 3];

export default function ClassEducatorDashboard() {
    const theme = useTheme();

    // 강의 기본 정보 (임시 데이터)
    const [courseInfo, setCourseInfo] = useState({
        course_id: 1,
        title: "React 기초부터 심화까지",
        instructor: "홍길동",
        category: "프로그래밍",
        difficulty: "MEDIUM",
        point: 1,
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

    const [openEditModal, setOpenEditModal] = useState(false);
    const [formData, setFormData] = useState({
        course_name: "",
        category: "",
        difficulty: "",
        point: "",
        description: "",
        max_enrollment: "",
    });

    // “강의 기본 정보 수정” 버튼을 가리키는 ref
    const editButtonRef = useRef(null);
    // 첫 포커스가 들어가야 할 모달 내의 첫 번째 필드(ref)
    const firstFieldRef = useRef(null);

    // 모달 열기: 기존 courseInfo를 formData로 복사
    const handleOpenEditModal = () => {
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

    // 모달 닫기
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    };

    // 모달이 완전히 열렸을 때, 포커스 이동
    const handleAfterModalOpen = () => {
        firstFieldRef.current?.focus?.();
    };

    // 모달이 완전히 닫혔을 때, 포커스 이동
    const handleAfterModalClose = () => {
        editButtonRef.current?.focus?.();
    };

    // 폼 입력 변경 처리
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const parsed = type === "number" ? Number(value) : value;
        setFormData((prev) => ({
            ...prev,
            [name]: parsed,
        }));
    };

    // “저장” 버튼 클릭 시 API 호출 & 로컬 상태 업데이트
    const handleSaveCourseInfo = async (e) => {
        e.preventDefault();
        try {
            // API 호출: modifyCourseInfoAPI(courseId, payload)
            await modifyCourseInfoAPI(courseInfo.course_id, {
                courseName: formData.course_name,
                category: formData.category,
                difficulty: formData.difficulty,
                point: formData.point,
                description: formData.description,
                maxEnrollment: formData.max_enrollment,
            });

            // 성공 시 로컬 상태에도 반영
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
                            {/* 카테고리 Select */}
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

                            {/* 강의명 TextField */}
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
                            {/* 학점 Select */}
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

                            {/* 난이도 Select */}
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

                            {/* 최대 수강 인원 TextField */}
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

                        {/* 상세 설명 TextField */}
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
