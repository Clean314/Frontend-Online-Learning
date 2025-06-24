import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Divider,
} from "@mui/material";
import "dayjs/locale/ko";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/auth/useAuth";
import { getStudentExamListAPI } from "../../api/exam";
import { fetchAverageAttendanceAPI } from "../../api/lectureHistory";
import { getMyEnrolledCourseByIdAPI } from "../../api/enrollment";
import CourseInfoSummary from "../../components/class_dashboard/CourseInfoSummary";
import CourseCalendar from "../../components/class_dashboard/CourseCalendar";
import StudentProgressBox from "../../components/class_dashboard/StudentProgressBox";

dayjs.locale("ko");

export default function StuClassDashboard() {
    const { courseId } = useParams();
    const { user } = useAuth();

    const [course, setCourse] = useState(null);
    const [lectureEvents, setLectureEvents] = useState([]);
    const [myProgressRate, setMyProgressRate] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const today = dayjs();

    // 강의 정보 조회
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

    // 시험 일정 조회
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

    // 내 출석률 조회
    useEffect(() => {
        const loadAttendance = async () => {
            try {
                const result = await fetchAverageAttendanceAPI(courseId);
                const myRecord = result.find((r) => r.memberId === user.id);

                if (!myRecord || typeof myRecord.attendanceAvg !== "number") {
                    setMyProgressRate(0);
                    return;
                }

                setMyProgressRate(Number(myRecord.attendanceAvg.toFixed(1)));
            } catch (err) {
                console.error("출석률 조회 실패:", err);
            }
        };

        loadAttendance();
    }, [courseId, user.id]);

    // 다음 시험 D-Day 계산
    const upcoming = lectureEvents
        .filter((e) => dayjs(e.end).isAfter(today, "minute"))
        .sort((a, b) => dayjs(a.start).diff(dayjs(b.start)));
    const nextExam = upcoming[0] || null;
    const daysUntilNextExam = nextExam
        ? dayjs(nextExam.start).diff(today, "day")
        : null;

    // 캘린더 상태
    const [selectedDate, setSelectedDate] = useState(today);
    const [viewDate, setViewDate] = useState(today);

    // 로딩 화면
    if (loading || !course) {
        return (
            <Paper sx={{ p: 3 }}>
                <Box textAlign="center" py={5}>
                    <CircularProgress />
                </Box>
            </Paper>
        );
    }

    // 에러 화면
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
            {/* 강의 요약 정보 */}
            <CourseInfoSummary courseInfo={course} role="STUDENT" />

            <Divider sx={{ mb: 3 }} />

            {/* 진행률 & 다음 시험 */}
            <StudentProgressBox
                nextExam={nextExam}
                daysUntilNextExam={daysUntilNextExam}
                myProgressRate={myProgressRate}
            />

            <Divider sx={{ mb: 3 }} />

            {/* 강의 일정 캘린더 */}
            <CourseCalendar
                lectureEvents={lectureEvents}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                viewDate={viewDate}
                setViewDate={setViewDate}
            />
        </Paper>
    );
}
