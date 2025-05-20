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

export default function CourseDetail() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const formatDate = useFormatDate();

    const navigate = useNavigate();

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

            return {
                id: i + 1,
                subjectCode: `SUBJ${String(i + 1).padStart(3, "0")}`,
                name: `강의 ${i + 1}`,
                educatorName: educatorNames[i % educatorNames.length],
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
                    {course.name}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                    ({course.subjectCode})
                </Typography>
            </Box>

            <Box display="flex" gap={2} mb={3}>
                {[
                    { label: "강사", value: course.educatorName },
                    { label: "카테고리", value: course.category },
                    { label: "난이도", value: course.difficulty },
                ].map((item) => (
                    <Box
                        key={item.label}
                        sx={{
                            flex: 1,
                            bgcolor: "grey.50",
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
                                primary={lec.title}
                                secondary={lec.duration}
                                primaryTypographyProps={{
                                    variant: "body2",
                                    fontWeight: 500,
                                }}
                                secondaryTypographyProps={{
                                    variant: "caption",
                                }}
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
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("edit")}
                >
                    수정
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                >
                    삭제
                </Button>
                <Button variant="outlined" onClick={() => navigate("/courses")}>
                    목록
                </Button>
            </Box>
        </Paper>
    );
}
