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
import { useTheme } from "@emotion/react";
import {
    cancelEnrollmentAPI,
    enrollCourseAPI,
    getMyEnrollmentsAPI,
} from "../../api/enrollment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { deleteCourseAPI } from "../../api/course";

export default function CourseDetail() {
    const { user } = useAuth();
    const theme = useTheme();

    const { courseId } = useParams();

    // 강의 정보
    const [course, setCourse] = useState(null);
    // 강의 영상 목록
    const [lectures, setLectures] = useState([]);

    const [isEnrolled, setIsEnrolled] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // 강의 정보 조회
    useEffect(() => {
        if (location.state) {
            setCourse(location.state.courseData);
        }
    }, [courseId, location.state]);

    // TODO: 강의 영상 목록 조회 API 연결
    useEffect(() => {
        const mockLectures = [
            { id: 1, title: "강의 소개", duration: "05:00" },
            { id: 2, title: "개발 환경 설정", duration: "10:30" },
            { id: 3, title: "Hello World 실습", duration: "07:15" },
        ];
        setLectures(mockLectures);
    }, []);

    // 내 수강 여부 조회
    useEffect(() => {
        if (user.role !== "STUDENT") return;
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
            setIsEnrolled(false);
            navigate("/learn/courses/my");
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

    const handleDelete = async () => {
        if (window.confirm("정말 이 강의를 삭제하시겠습니까?")) {
            try {
                await deleteCourseAPI(Number(courseId));

                alert("삭제되었습니다.");
                navigate("/teach/courses/my");
            } catch (error) {
                alert("강의 삭제 중 오류가 발생했습니다.");
                console.log("강의 삭제 실패 : " + error);
            }
        }
    };

    const canGoClassroom =
        user.role === "EDUCATOR" || (user.role === "STUDENT" && isEnrolled);

    // 뒤로 가기: 이전 URL에 'myCourses'가 있으면 뒤로, 아니면 역할별 목록으로
    const handleBack = () => {
        const prev = document.referrer;
        const cameFromMy =
            prev.includes("/teach/courses/my") ||
            prev.includes("/learn/courses/my") ||
            prev.includes("/courses");

        if (cameFromMy) {
            navigate(-1);
        } else if (user.role === "EDUCATOR") {
            navigate("/teach/courses/my");
        } else if (user.role === "STUDENT") {
            navigate("/learn/courses/my");
        } else {
            navigate(-1);
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ borderBottom: 1, borderColor: "divider", pb: 1, mb: 3 }}
            >
                {/* 뒤로 가기 화살표 */}
                <IconButton size="small" onClick={handleBack} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>

                <Typography variant="h5" sx={{ fontWeight: 600, flexGrow: 1 }}>
                    {course.course_name}
                </Typography>

                {/* 강의실 이동 버튼 */}
                {canGoClassroom && (
                    <Button
                        variant="contained"
                        size="medium"
                        sx={{
                            bgcolor: theme.palette.secondary.main,
                            "&:hover": {
                                bgcolor: theme.palette.secondary.dark,
                            },
                        }}
                        onClick={() =>
                            navigate(`/courses/${course.course_id}/classroom`)
                        }
                    >
                        강의실로 이동
                    </Button>
                )}
            </Box>

            <Box display="flex" gap={2} mb={3}>
                {[
                    { label: "강사", value: course.educator_name },
                    { label: "카테고리", value: course.category },
                    { label: "난이도", value: course.difficulty },
                    { label: "학점", value: course.point },
                ].map((item) => (
                    <Box
                        key={item.label}
                        sx={{
                            flex: 1,
                            bgcolor: (theme) =>
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

            <Typography variant="body1" color="text.secondary" mb={4}>
                {course.description}
            </Typography>

            <Typography variant="h6" gutterBottom>
                커리큘럼
            </Typography>
            <List disablePadding sx={{ mb: 4 }}>
                {lectures.map((lec, idx) => (
                    <React.Fragment key={lec.id}>
                        <ListItem
                            sx={{
                                px: 0,
                                py: 1,
                                "&:hover": { bgcolor: "action.hover" },
                            }}
                        >
                            <ListItemText
                                disableTypography
                                primary={
                                    <Typography
                                        variant="body2"
                                        fontWeight={500}
                                    >
                                        {lec.title}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="caption">
                                        {lec.duration}
                                    </Typography>
                                }
                            />
                        </ListItem>
                        {idx < lectures.length - 1 && (
                            <Divider component="li" />
                        )}
                    </React.Fragment>
                ))}
            </List>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 4,
                }}
            >
                {user.role === "STUDENT" ? (
                    <Button
                        size="medium"
                        variant="contained"
                        color="primary"
                        onClick={isEnrolled ? cancelEnroll : enroll}
                    >
                        {isEnrolled ? "수강 취소" : "수강 신청"}
                    </Button>
                ) : (
                    <Button
                        size="medium"
                        variant="contained"
                        color="primary"
                        onClick={() =>
                            navigate("edit", {
                                state: { courseData: course },
                            })
                        }
                    >
                        수정
                    </Button>
                )}
                {user.role === "EDUCATOR" && (
                    <Button
                        size="medium"
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                    >
                        삭제
                    </Button>
                )}
            </Box>
        </Paper>
    );
}
