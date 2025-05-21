import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFormatDate from "../../hooks/useFormatDate";
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
} from "@mui/material";
import useAuth from "../../hooks/auth/useAuth";
import { useTheme } from "@emotion/react";
import {
    cancelEnrollmentAPI,
    enrollCourseAPI,
    getMyEnrollmentsAPI,
} from "../../api/enrollment";

export default function CourseDetail() {
    const { user } = useAuth();
    const theme = useTheme();

    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);

    const formatDate = useFormatDate();

    const navigate = useNavigate();

    // // 강의 상세 정보 조회 (미구현)
    // useEffect(() => {
    //     const fetchCourse = async () => {
    //         try {
    //             const res = await api.get(`/courses/${courseId}`);
    //             setCourse(res.data);
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     };
    //     fetchCourse();
    // }, [id]);

    // 수강 신청
    const enroll = async () => {
        try {
            await enrollCourseAPI(Number(courseId));

            alert("수강 신청이 완료되었습니다.");
            navigate("/learn/myCourses");
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
            navigate("/learn/myCourses");
        } catch (err) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                    "수강 취소 중 오류가 발생했습니다."
            );
        }
    };

    // 수강 신청된 강의인지 확인(내 수강 목록에서 이 강의가 신청됐는지 체크)
    useEffect(() => {
        if (user.role === "STUDENT") {
            const checkEnrollment = async () => {
                try {
                    const list = await getMyEnrollmentsAPI();

                    // EnrollmentDTO 에 courseId 프로퍼티가 있다고 가정
                    const enrolled = list.some(
                        (e) => e.courseId === Number(courseId)
                    );

                    setIsEnrolled(enrolled);
                } catch (err) {
                    console.error("내 수강목록 조회 실패", err);
                }
            };
            checkEnrollment();
        }
    }, [courseId, user.role]);

    useEffect(() => {
        // 임시 데이터 생성
        const educatorNames = [
            "김철수",
            "이영희",
            "박민수",
            "최유리",
            "홍길동",
        ];
        const categories = [
            "프로그래밍",
            "데이터베이스",
            "네트워크",
            "보안",
            "AI",
        ];
        const difficulties = ["EASY", "MEDIUM", "HARD"];

        const baseCreated = new Date(2025, 3, 1, 9, 0, 0);
        const baseUpdated = new Date(2025, 3, 1, 10, 0, 0);

        const mockData = Array.from({ length: 100 }, (_, i) => {
            const created = new Date(baseCreated);
            created.setDate(created.getDate() + i);

            const updated = new Date(baseUpdated);
            updated.setDate(updated.getDate() + i);

            // mock lectures
            const lectures = Array.from({ length: 5 }, (_, j) => ({
                id: j + 1,
                title: `${i + 1} - ${j + 1}강: 주요 주제 ${j + 1}`,
                duration: `${10 + j * 5}분`,
            }));

            const point = (i % 3) + 1;

            return {
                id: i + 1,
                course_name: `강의 ${i + 1}`,
                educatorName: educatorNames[i % educatorNames.length],
                point,
                createdAt: created.toISOString(),
                updatedAt: updated.toISOString(),
                description: `강의 ${i + 1}에 대한 상세 설명입니다. 핵심 개념과 실습 예제를 포함합니다.`,
                category: categories[i % categories.length],
                difficulty: difficulties[i % difficulties.length],
                lectures,
            };
        });

        const found = mockData.find((c) => c.id === Number(courseId));
        setCourse(found || null);
    }, [courseId]);

    if (!course) {
        return <Typography>해당 강의를 찾을 수 없습니다.</Typography>;
    }

    const handleDelete = () => {
        if (window.confirm("정말 이 강의를 삭제하시겠습니까?")) {
            // TODO: delete API 호출

            alert("삭제되었습니다.");
            navigate("/learn/courses");
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Box
                display="flex"
                alignItems="baseline"
                gap={1}
                sx={{ borderBottom: 1, borderColor: "divider", pb: 1, mb: 3 }}
            >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {course.course_name}
                </Typography>
            </Box>

            <Box display="flex" gap={2} mb={3}>
                {[
                    { label: "강사", value: course.educatorName },
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
                {course.lectures.map((lec, idx) => (
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
                        {idx < course.lectures.length - 1 && (
                            <Divider component="li" />
                        )}
                    </React.Fragment>
                ))}
            </List>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 4,
                    borderTop: 1,
                    borderColor: "divider",
                    pt: 2,
                }}
            >
                <Typography variant="body2">
                    <strong>등록일:</strong> {formatDate(course.createdAt)}
                </Typography>
                <Typography variant="body2">
                    <strong>수정일:</strong> {formatDate(course.updatedAt)}
                </Typography>
            </Box>

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
                        {isEnrolled ? "수강 취소" : "수강신청"}
                    </Button>
                ) : (
                    <Button
                        size="medium"
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("edit")}
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
                <Button
                    size="medium"
                    variant="outlined"
                    sx={{
                        color: theme.palette.primary.dark,
                        "&:hover": {
                            bgcolor: theme.palette.grey[50],
                        },
                    }}
                    onClick={() => navigate("/courses")}
                >
                    목록
                </Button>
            </Box>
        </Paper>
    );
}
