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
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function QuestionFormPage() {
    const { courseId, examId, questionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const isEditMode = Boolean(questionId);
    // 편집 모드일 경우, location에서 데이터 꺼재기
    const existingQuestion = isEditMode ? location.state?.question : null;

    const [content, setContent] = useState("");
    const [type, setType] = useState("MULTIPLE_CHOICE");
    const [score, setScore] = useState("");
    const [multipleChoices, setMultipleChoices] = useState(["", ""]);
    // answerIndex:
    // for MULTIPLE_CHOICE, 1-based index;
    // for TRUE_FALSE, 0 for "참", 1 for "거짓"
    const [answerIndex, setAnswerIndex] = useState(null);

    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isEditMode && existingQuestion) {
            setContent(existingQuestion.content); // 문제 내용
            setType(existingQuestion.type); // 문제 유형
            setScore(String(existingQuestion.score)); // 배점 (숫자 -> 문자열 변환)
            // 선택지
            if (existingQuestion.type === "MULTIPLE_CHOICE") {
                setMultipleChoices([...existingQuestion.multipleChoices]);
            } else {
                setMultipleChoices(["", ""]);
            }
            setAnswerIndex(existingQuestion.answerIndex ?? null); // 정답
            setLoading(false);
        }
    }, [isEditMode, existingQuestion]);

    const handleChoiceChange = (index, value) => {
        setMultipleChoices((prev) =>
            prev.map((c, i) => (i === index ? value : c))
        );
    };

    const addChoice = () => {
        if (multipleChoices.length >= 10) return;

        setMultipleChoices((prev) => [...prev, ""]);
    };

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

    const handleSubmit = async () => {
        // 문제 유형별 유효성 검사
        if (!content.trim()) {
            setError("문제 내용을 입력해주세요.");
            return;
        }
        if (!Number.isInteger(score) || score < 0 || score > 100) {
            setError("배점은 0에서 100 사이의 자연수여야 합니다.");
            return;
        }
        if (type === "MULTIPLE_CHOICE") {
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
            content,
            type,
            score,
            choices: type === "MULTIPLE_CHOICE" ? multipleChoices : [],
            answerIndex: answerIndex,
        };

        if (isEditMode) {
            // TODO: API 호출 구현 필요 (updateQuestionAPI)
            console.log("수정 데이터:", payload);
        } else {
            // TODO: API 호출 구현 필요 (createQuestionAPI)
            console.log("생성 데이터:", payload);
        }
        navigate(`/courses/${courseId}/exams/${examId}/questions`);
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
                                <option value="MULTIPLE_CHOICE">선다형</option>
                                <option value="TRUE_FALSE">진위형</option>
                            </TextField>

                            <TextField
                                label="배점"
                                type="number"
                                slotProps={{
                                    htmlInput: { min: 0, max: 100, step: 1 },
                                }}
                                value={score}
                                onChange={(e) =>
                                    setScore(Number(e.target.value))
                                }
                                fullWidth
                            />
                        </Box>

                        {type === "MULTIPLE_CHOICE" && (
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
                            <Button variant="contained" onClick={handleSubmit}>
                                저장
                            </Button>
                        </Box>
                    </Stack>
                )}
            </Paper>
        </Container>
    );
}
