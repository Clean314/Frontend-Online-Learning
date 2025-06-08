import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    IconButton,
} from "@mui/material";
import useAuth from "../../hooks/auth/useAuth";
import {
    cancelEnrollmentAPI,
    enrollCourseAPI,
    getMyEnrollmentsAPI,
} from "../../api/enrollment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getStudentLectureListAPI } from "../../api/lecture";
import BackButton from "../../components/common/BackButton";
import CourseInfoBoxes from "../../components/common/CourseInfoBoxes";
import CurriculumList from "../../components/course_detail/CurriculumList";
import EnrollmentActions from "../../components/course_detail/EnrollmentActions";
import { ROLES } from "../../roles";

export default function CourseDetail() {
    const { user } = useAuth();

    const { courseId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [course, setCourse] = useState(null); // 강의 정보
    const [lectures, setLectures] = useState([]); // 강의 영상 목록
    const [isEnrolled, setIsEnrolled] = useState(false);

    // 강의 정보 조회
    useEffect(() => {
        if (location.state) {
            setCourse(location.state.courseData);
        }
    }, [courseId, location.state]);

    // 강의 영상 목록 조회
    useEffect(() => {
        (async () => {
            try {
                const data = await getStudentLectureListAPI(Number(courseId));
                setLectures(data);
            } catch (err) {
                console.error("강의 영상 목록 조회 실패:", err);
            }
        })();
    }, [courseId]);

    // 내 수강 여부 조회
    useEffect(() => {
        if (user.role !== ROLES.STUDENT) return;
        (async () => {
            try {
                const list = await getMyEnrollmentsAPI();
                setIsEnrolled(
                    list.some((e) => e.course_id === Number(courseId))
                );
            } catch (err) {
                console.error("내 수강목록 조회 실패", err);
            }
        })();
    }, [courseId, user.role]);

    // 수강 신청
    const enroll = async () => {
        try {
            await enrollCourseAPI(Number(courseId));

            alert("수강 신청이 완료되었습니다.");
            navigate("/learn/courses/my");
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                    "수강 신청 중 오류가 발생했습니다."
            );
        }
    };

    // 수강 취소
    const cancelEnroll = async () => {
        try {
            await cancelEnrollmentAPI(Number(courseId));

            alert("수강이 취소되었습니다.");
            navigate(-1);
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                    "수강 취소 중 오류가 발생했습니다."
            );
        }
    };

    if (!course) {
        return <Typography>해당 강의를 찾을 수 없습니다.</Typography>;
    }

    const infoItems = [
        { label: "강사", value: course.educator_name },
        { label: "카테고리", value: course.category },
        { label: "난이도", value: course.difficulty },
        { label: "학점", value: course.point },
    ];

    return (
        <Paper sx={{ p: 3 }}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ borderBottom: 1, borderColor: "divider", pb: 1, mb: 3 }}
            >
                <BackButton onClick={() => navigate(-1)} />

                <Typography variant="h5" sx={{ fontWeight: 600, flexGrow: 1 }}>
                    {course.course_name}
                </Typography>
            </Box>

            <CourseInfoBoxes items={infoItems} />

            <Typography variant="body1" color="text.secondary" mb={4}>
                {course.description}
            </Typography>

            <Typography variant="h6" gutterBottom>
                커리큘럼
            </Typography>
            <CurriculumList lectures={lectures} />

            <EnrollmentActions
                isStudent={user.role === "STUDENT"}
                isEnrolled={isEnrolled}
                onEnroll={enroll}
                onCancel={cancelEnroll}
            />
        </Paper>
    );
}
