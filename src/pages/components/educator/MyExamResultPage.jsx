import {
    Container,
    Paper,
    Typography,
    Box,
    Radio,
    RadioGroup,
    FormControlLabel,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import { useEffect, useState } from "react";
import { getQuestionListAPI } from "../../../api/question";

export default function MyExamResultPage() {
    const { courseId, examId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { totalScore, student } = location.state || {};
    const myResult = student;

    const [questionMap, setQuestionMap] = useState({});

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const questions = await getQuestionListAPI(
                    Number(courseId),
                    Number(examId)
                );
                const map = {};
                questions.forEach((q) => {
                    map[q.id] = q;
                });
                setQuestionMap(map);
            } catch (err) {
                console.error("문제 목록 조회 실패:", err);
            }
        };
        fetchQuestions();
    }, [courseId, examId]);

    // 뒤로가기 로직
    const handleBack = () => {
        const path = location.pathname;
        if (path.includes("/learn/")) {
            navigate(`/courses/${courseId}/classroom/learn/exams`);
        } else if (path.includes("/teach/")) {
            navigate(
                `/courses/${courseId}/classroom/teach/exams/${examId}/scores`
            );
        } else {
            navigate(-1);
        }
    };

    if (!student) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography>응시 정보가 없습니다.</Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box display="flex" gap={1} alignItems="center" mb={2}>
                    <BackButton onClick={handleBack} />
                    <Typography variant="h5">
                        {student.studentName} 님의 성적
                    </Typography>
                    <Typography variant="subtitle1">
                        : {myResult.totalScore} &nbsp;/&nbsp;{totalScore ?? 0}점
                    </Typography>
                </Box>

                {student.answers.map((item, idx) => {
                    const question = questionMap[item.questionId];
                    if (!question) return null;

                    const isChoice =
                        question.question_type === "CHOICE" ||
                        question.question_type === "TRUE_FALSE";

                    // 보기 설정
                    const choices =
                        question.question_type === "TRUE_FALSE"
                            ? { 0: "참", 1: "거짓" }
                            : question.choices?.reduce((obj, choice, index) => {
                                  obj[String(index)] = choice;
                                  return obj;
                              }, {}) || {};

                    // 정답 인덱스
                    const correctIndex =
                        question.question_type === "TRUE_FALSE"
                            ? question.answer
                            : String(question.choices.indexOf(question.answer));

                    // 응시자가 제출한 답 (문자열로 통일)
                    const selected = String(item.answer);

                    return (
                        <Paper
                            key={idx}
                            sx={{
                                p: 2,
                                mb: 2,
                                bgcolor: item.correct ? "#E8F9FF" : "#FFEDF3",
                            }}
                        >
                            <Typography variant="subtitle2" gutterBottom>
                                {`문제 ${idx + 1} (${question.question_type === "CHOICE" ? "선다형" : "진위형"} / 배점 ${question.score}점)`}
                            </Typography>
                            <Typography variant="body2" mb={1}>
                                {question.content}
                            </Typography>
                            <RadioGroup value={selected}>
                                {Object.entries(choices).map(([key, label]) => {
                                    const isCorrectChoice =
                                        key === correctIndex;
                                    return (
                                        <FormControlLabel
                                            key={key}
                                            value={String(key)}
                                            control={
                                                <Radio
                                                    slotProps={{
                                                        input: {
                                                            readOnly: true,
                                                        },
                                                    }}
                                                />
                                            }
                                            label={`${label}${isCorrectChoice ? " (정답)" : ""}`}
                                            slotProps={{
                                                label: {
                                                    sx: {
                                                        fontWeight:
                                                            isCorrectChoice
                                                                ? "bold"
                                                                : "normal",
                                                    },
                                                },
                                            }}
                                        />
                                    );
                                })}
                            </RadioGroup>
                            <Typography
                                variant="body2"
                                color={item.correct ? "#4DA8DA" : "error"}
                            >
                                {item.correct ? "정답입니다." : "틀렸습니다."}
                            </Typography>
                        </Paper>
                    );
                })}
            </Paper>
        </Container>
    );
}
