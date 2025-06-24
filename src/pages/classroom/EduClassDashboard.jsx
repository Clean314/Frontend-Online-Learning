import { useState, useEffect, useRef } from "react";
import { Typography, Paper, Divider } from "@mui/material";
import "dayjs/locale/ko";
import dayjs from "dayjs";
import { getCourseInfoAPI, modifyCourseInfoAPI } from "../../api/course";
import { useParams } from "react-router-dom";
import { getExamListAPI } from "../../api/exam";
import { getCourseAvgAttendanceAPI } from "../../api/lectureHistory";
import EditCourseDialog from "../../components/class_dashboard/EditCourseDialog";
import CourseInfoSummary from "../../components/class_dashboard/CourseInfoSummary";
import EnrollmentStatsBox from "../../components/class_dashboard/EnrollmentStatsBox";
import CourseCalendar from "../../components/class_dashboard/CourseCalendar";
dayjs.locale("ko");

export default function EduClassDashboard() {
    const { courseId } = useParams();

    const [courseInfo, setCourseInfo] = useState(null); // 강의 기본 정보
    const [avgAttendanceRate, setAvgAttendanceRate] = useState(null); // 평균 수강률
    const [lectureEvents, setLectureEvents] = useState([]); // 시험 일정
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentEnrolled, setCurrentEnrolled] = useState(0);

    // 강의 기본 정보 조회
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

    // 평균 출석률 조회
    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await getCourseAvgAttendanceAPI(Number(courseId));

                setAvgAttendanceRate(Number(res.toFixed(1))); // 정수 %로 표시
            } catch (err) {
                console.error("출석 정보 조회 실패:", err);
                setAvgAttendanceRate(null);
            }
        };

        fetchAttendance();
    }, [courseId]);

    // 시험 일정 조회
    useEffect(() => {
        const loadExams = async () => {
            try {
                const data = await getExamListAPI(Number(courseId));
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

    // courseInfo가 설정된 후 currentEnrolled 계산
    useEffect(() => {
        if (courseInfo) {
            setCurrentEnrolled(
                courseInfo.max_enrollment - courseInfo.available_enrollment
            );
        }
    }, [courseInfo]);

    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [viewDate, setViewDate] = useState(dayjs());

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
                available_enrollment: formData.max_enrollment,
            }));
            setOpenEditModal(false);
            alert("강의 정보가 성공적으로 수정되었습니다.");
        } catch (error) {
            console.error("강의 수정 실패:", error);
            alert("강의 수정에 실패했습니다. 다시 시도해주세요.");
        }
    };

    if (!courseInfo || loading) {
        return <Typography>로딩 중...</Typography>;
    }

    return (
        <Paper sx={{ p: 3 }}>
            {/* 에러 메시지 */}
            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}
            {/* 상단 헤더 */}
            <CourseInfoSummary
                courseInfo={courseInfo}
                onEditClick={handleOpenEditModal}
                editButtonRef={editButtonRef}
                role="EDUCATOR"
            />

            <Divider sx={{ mb: 3 }} />

            {/* 수강생 총괄 현황 & 수강률 평균 */}
            <EnrollmentStatsBox
                currentEnrolled={currentEnrolled}
                maxEnrollment={courseInfo.max_enrollment}
                avgAttendanceRate={avgAttendanceRate}
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

            {/* 강의 기본 정보 편집 모달 */}
            <EditCourseDialog
                open={openEditModal}
                onClose={handleCloseEditModal}
                onSave={handleSaveCourseInfo}
                formData={formData}
                setFormData={setFormData}
                firstFieldRef={firstFieldRef}
                editButtonRef={editButtonRef}
            />
        </Paper>
    );
}
