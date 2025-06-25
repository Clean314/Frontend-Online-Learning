import { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createQuestionAPI, updateQuestionAPI } from "../../api/question";
import QuestionContentField from "../../components/question/QuestionContentField";
import QuestionTypeSelector from "../../components/question/QuestionTypeSelector";
import ChoiceListEditor from "../../components/question/ChoiceListEditor";
import TrueFalseSelector from "../../components/question/TrueFalseSelector";
import QuestionFormActions from "../../components/question/QuestionFormActions";

export default function QuestionForm() {
    const { courseId, examId, questionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const isEditMode = Boolean(questionId);

    const exam = location.state?.exam;
    const suggestedNumber = location.state?.suggestedNumber;
    // 편집 모드일 경우, location에서 데이터 꺼재기
    const existingQuestion = isEditMode ? location.state?.question : null;

    const [content, setContent] = useState("");
    const [type, setType] = useState("CHOICE");
    const [score, setScore] = useState("");
    const [multipleChoices, setMultipleChoices] = useState(["", ""]);
    const [answerIndex, setAnswerIndex] = useState(null);

    const [loading, setLoading] = useState(isEditMode);
    const [successOpen, setSuccessOpen] = useState(false); // 스낵바
    const [error, setError] = useState("");

    // 편집 모드일 경우 기존 내용 렌더링
    useEffect(() => {
        if (isEditMode && existingQuestion) {
            setContent(existingQuestion.content);
            setType(existingQuestion.question_type);
            setScore(String(existingQuestion.score));

            setMultipleChoices([...existingQuestion.choices]);

            // 정답 문자열의 index를 찾아서 answerIndex 설정
            const index = existingQuestion.choices.indexOf(
                existingQuestion.answer
            );
            setAnswerIndex(index !== -1 ? index : null);

            setLoading(false);
        }
    }, [isEditMode, existingQuestion]);

    // 폼 제출 (수정 or 생성)
    const handleSubmit = async () => {
        // 문제 유형별 유효성 검사
        if (!content.trim()) {
            setError("문제 내용을 입력해주세요.");
            return;
        }
        if (!score.trim()) {
            setError("배점을 입력해주세요.");
            return;
        }

        const parsedScore = Number(score);
        if (
            score.trim() === "" ||
            !Number.isInteger(parsedScore) ||
            parsedScore < 0 ||
            parsedScore > 100
        ) {
            setError("배점은 0에서 100 사이의 자연수여야 합니다.");
            return;
        }

        if (multipleChoices.length < 2) {
            setError("선다형 문제는 최소 2개 이상의 선택지가 필요합니다.");
            return;
        }
        if (multipleChoices.length > 10) {
            setError("선다형 문제의 선택지는 최대 10개까지 허용됩니다.");
            return;
        }

        if (answerIndex == null) {
            setError("정답 선택지를 선택해주세요.");
            return;
        }

        if (type === "CHOICE") {
            for (let i = 0; i < multipleChoices.length; i++) {
                if (!multipleChoices[i].trim()) {
                    setError(`선택지 ${i + 1}의 내용을 입력해주세요.`);
                    return;
                }
            }
        }

        const payload = {
            number: Number(existingQuestion?.number ?? suggestedNumber ?? 0),
            content,
            question_type: type,
            score: parsedScore,
        };

        if (type === "CHOICE") {
            payload.choices = multipleChoices;
            payload.answer = multipleChoices[answerIndex];
        } else if (type === "TRUE_FALSE") {
            payload.choices = ["true", "false"];
            payload.answer = answerIndex === 0 ? "true" : "false";
        }

        try {
            if (isEditMode) {
                await updateQuestionAPI(courseId, examId, questionId, payload);
            } else {
                await createQuestionAPI(courseId, examId, payload);
            }

            setSuccessOpen(true);
            setTimeout(() => {
                navigate(
                    `/courses/${courseId}/classroom/teach/exams/${examId}/questions`,
                    { state: { exam } }
                );
            }, 1000);
        } catch (err) {
            console.error(err);
            setError("저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <Container sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" mb={2}>
                    {isEditMode ? "문제 수정" : "새 문제 추가"}
                </Typography>

                {loading ? (
                    <Box textAlign="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <QuestionContentField
                            value={content}
                            onChange={setContent}
                        />
                        <QuestionTypeSelector
                            type={type}
                            score={score}
                            onTypeChange={setType}
                            onScoreChange={setScore}
                            resetChoices={() => {
                                setMultipleChoices(["", ""]);
                                setAnswerIndex(null);
                            }}
                        />
                        {type === "CHOICE" ? (
                            <ChoiceListEditor
                                choices={multipleChoices}
                                onChange={setMultipleChoices}
                                answerIndex={answerIndex}
                                setAnswerIndex={setAnswerIndex}
                            />
                        ) : (
                            <TrueFalseSelector
                                answerIndex={answerIndex}
                                setAnswerIndex={setAnswerIndex}
                            />
                        )}
                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}
                        <QuestionFormActions
                            loading={loading}
                            onCancel={() => navigate(-1)}
                            onSubmit={handleSubmit}
                        />
                    </>
                )}
            </Paper>
            <Snackbar
                open={successOpen}
                autoHideDuration={2000}
                onClose={() => setSuccessOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="success" sx={{ width: "100%" }}>
                    문제가 저장되었습니다!
                </Alert>
            </Snackbar>
        </Container>
    );
}
