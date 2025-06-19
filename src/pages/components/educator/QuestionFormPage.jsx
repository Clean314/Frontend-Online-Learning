import React, { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    Stack,
    IconButton,
    Radio,
    FormControlLabel,
    RadioGroup,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createQuestionAPI, updateQuestionAPI } from "../../../api/question";

export default function QuestionFormPage() {
    const { courseId, examId, questionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const isEditMode = Boolean(questionId);

    const exam = location.state?.exam;
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
            setType(existingQuestion.questionType); // ← 수정: 기존에는 .type 사용했을 수 있음
            setScore(String(existingQuestion.score));

            if (existingQuestion.questionType === "CHOICE") {
                setMultipleChoices([...existingQuestion.choices]);

                // 정답 문자열의 index를 찾아서 answerIndex 설정
                const index = existingQuestion.choices.indexOf(
                    existingQuestion.answer
                );
                setAnswerIndex(index !== -1 ? index : null);
            } else {
                // TRUE_FALSE 타입은 0 또는 1 그대로 사용
                setMultipleChoices(["참", "거짓"]);
                setAnswerIndex(Number(existingQuestion.answer));
            }

            setLoading(false);
        }
    }, [isEditMode, existingQuestion]);

    // 선택지 배열 관리
    const handleChoiceChange = (index, value) => {
        setMultipleChoices((prev) =>
            prev.map((c, i) => (i === index ? value : c))
        );
    };

    // 선택지 추가
    const addChoice = () => {
        if (multipleChoices.length >= 10) return;

        setMultipleChoices((prev) => [...prev, ""]);
    };

    // 선택지 제거
    const removeChoice = (index) => {
        if (multipleChoices.length <= 2) return;

        setMultipleChoices((prev) => prev.filter((_, i) => i !== index));
        if (answerIndex === index) {
            setAnswerIndex(null);
        } else if (answerIndex > index) {
            // shift answerIndex down if after removed
            setAnswerIndex((prev) => (prev != null ? prev - 1 : prev));
        }
    };

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

        if (type === "CHOICE") {
            if (multipleChoices.length < 2) {
                setError("선다형 문제는 최소 2개 이상의 선택지가 필요합니다.");
                return;
            }
            if (multipleChoices.length > 10) {
                setError("선다형 문제의 선택지는 최대 10개까지 허용됩니다.");
                return;
            }
            for (let i = 0; i < multipleChoices.length; i++) {
                if (!multipleChoices[i].trim()) {
                    setError(`선택지 ${i + 1}의 내용을 입력해주세요.`);
                    return;
                }
            }
            if (answerIndex == null) {
                setError("정답 선택지를 선택해주세요.");
                return;
            }
        }
        if (type === "TRUE_FALSE" && answerIndex == null) {
            setError("참/거짓 정답을 선택해주세요.");
            return;
        }

        const payload = {
            number: Number(existingQuestion?.number ?? 0), // 새로 만들 경우는 백엔드에서 자동 생성
            content,
            questionType: type,
            score: parsedScore,
            choices: type === "CHOICE" ? multipleChoices : [],
            answer: answerIndex,
        };

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
                    <Stack spacing={2}>
                        <TextField
                            label="문제 내용"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            multiline
                            rows={4}
                            fullWidth
                        />

                        <Box display={"flex"} gap={2}>
                            <TextField
                                select
                                label="문제 유형"
                                value={type}
                                onChange={(e) => {
                                    setType(e.target.value);
                                    // 초기화
                                    setMultipleChoices(["", ""]);
                                    setAnswerIndex(null);
                                }}
                                slotProps={{
                                    select: { native: true },
                                }}
                                fullWidth
                            >
                                <option value="CHOICE">선다형</option>
                                <option value="TRUE_FALSE">진위형</option>
                            </TextField>

                            <TextField
                                label="배점"
                                type="number"
                                slotProps={{
                                    htmlInput: { min: 0, max: 100, step: 1 },
                                }}
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                                fullWidth
                            />
                        </Box>

                        {type === "CHOICE" && (
                            <Box>
                                <Typography variant="subtitle1" mb={1}>
                                    선택지
                                </Typography>
                                {multipleChoices.map((choice, idx) => (
                                    <Box
                                        key={idx}
                                        display="flex"
                                        alignItems="center"
                                        mb={1}
                                    >
                                        <Radio
                                            checked={answerIndex === idx}
                                            onChange={() => setAnswerIndex(idx)}
                                            value={idx}
                                        />
                                        <TextField
                                            placeholder={`보기 ${idx + 1}`}
                                            value={choice}
                                            onChange={(e) =>
                                                handleChoiceChange(
                                                    idx,
                                                    e.target.value
                                                )
                                            }
                                            fullWidth
                                            error={!choice.trim()} // 빈 칸이면 빨간 테두리
                                        />
                                        <IconButton
                                            color="error"
                                            onClick={() => removeChoice(idx)}
                                            sx={{ ml: 1 }}
                                            size="small"
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                    </Box>
                                ))}
                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={addChoice}
                                    size="small"
                                    sx={{ mt: 1 }}
                                >
                                    선택지 추가
                                </Button>
                            </Box>
                        )}

                        {type === "TRUE_FALSE" && (
                            <Box>
                                <Typography variant="subtitle1" mb={1}>
                                    정답 선택
                                </Typography>
                                <RadioGroup
                                    value={
                                        answerIndex != null
                                            ? String(answerIndex)
                                            : ""
                                    }
                                    onChange={(e) =>
                                        setAnswerIndex(Number(e.target.value))
                                    }
                                >
                                    <FormControlLabel
                                        value="0"
                                        control={<Radio />}
                                        label="참"
                                    />
                                    <FormControlLabel
                                        value="1"
                                        control={<Radio />}
                                        label="거짓"
                                    />
                                </RadioGroup>
                            </Box>
                        )}

                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}

                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate(-1)}
                                sx={{ mr: 1 }}
                            >
                                취소
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress
                                        size={24}
                                        color="inherit"
                                    />
                                ) : (
                                    "저장"
                                )}
                            </Button>
                        </Box>
                    </Stack>
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
