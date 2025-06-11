// QuestionDetailPage.jsx
import React, { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    TextField,
    Stack,
    Radio,
    FormControlLabel,
    RadioGroup,
    CircularProgress,
    IconButton,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function QuestionDetailPage() {
    const { courseId, examId, questionId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // 상위에서 넘겨받은 question 객체
    const question = location.state?.question;
    const [loading, setLoading] = useState(true);

    // 필드 상태 (읽기 전용)
    const [content, setContent] = useState("");
    const [type, setType] = useState("");
    const [score, setScore] = useState("");
    const [multipleChoices, setMultipleChoices] = useState([]);
    const [answerIndex, setAnswerIndex] = useState(null);
    const [answerText, setAnswerText] = useState("");
    const [explanation, setExplanation] = useState("");

    useEffect(() => {
        if (question) {
            setContent(question.content);
            setType(question.type);
            setScore(String(question.score));

            if (question.type === "MULTIPLE_CHOICE") {
                setMultipleChoices([...question.multipleChoices]);
                setAnswerIndex(question.answerIndex);
            } else if (question.type === "TRUE_FALSE") {
                setAnswerIndex(question.answerIndex);
            } else {
                setAnswerText(question.answerText || "");
            }
            setExplanation(question.answerText || "");
            setLoading(false);
        }
    }, [question]);

    const getTypeLabel = (type) => {
        switch (type) {
            case "MULTIPLE_CHOICE":
                return "선다형";
            case "TRUE_FALSE":
                return "진위형";
            default:
                return type;
        }
    };

    // 읽기 전용 화면에서 "정답 번호" 표시 (1-based)
    const getAnswerDisplay = () => {
        if (type === "MULTIPLE_CHOICE") {
            return answerIndex != null ? String(answerIndex + 1) : "-";
        }
        if (type === "TRUE_FALSE") {
            if (answerIndex === 0) return "거짓";
            if (answerIndex === 1) return "참";
            return "-";
        }
        return "-";
    };

    return (
        <Container sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5">문제 상세 조회</Typography>
                </Box>

                {loading ? (
                    <Box textAlign="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        {/* 문제 내용 (읽기 전용) */}
                        <TextField
                            label="문제 내용"
                            value={content}
                            multiline
                            rows={4}
                            fullWidth
                            slotProps={{
                                input: { readOnly: true },
                            }}
                        />

                        {/* 유형 + 배점 */}
                        <Box display="flex" gap={2}>
                            <TextField
                                label="문제 유형"
                                value={getTypeLabel(type)}
                                fullWidth
                                slotProps={{
                                    input: { readOnly: true },
                                }}
                            />
                            <TextField
                                label="배점"
                                value={score}
                                fullWidth
                                slotProps={{
                                    input: { readOnly: true },
                                }}
                            />
                        </Box>

                        {/* 선다형: 선택지 목록 + 정답 표시 */}
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
                                            disabled
                                        />
                                        <TextField
                                            value={choice}
                                            fullWidth
                                            slotProps={{
                                                input: { readOnly: true },
                                            }}
                                        />
                                    </Box>
                                ))}
                                <Typography variant="body2" mt={1}>
                                    <strong>정답 번호:</strong>{" "}
                                    {getAnswerDisplay()}
                                </Typography>
                            </Box>
                        )}

                        {/* 진위형: "참"/"거짓" 라디오에 checked 표시 */}
                        {type === "TRUE_FALSE" && (
                            <Box>
                                <Typography variant="subtitle1" mb={1}>
                                    정답
                                </Typography>
                                <RadioGroup
                                    value={
                                        answerIndex != null
                                            ? String(answerIndex)
                                            : ""
                                    }
                                >
                                    <FormControlLabel
                                        value="0"
                                        control={<Radio />}
                                        label="참"
                                        disabled
                                    />
                                    <FormControlLabel
                                        value="1"
                                        control={<Radio />}
                                        label="거짓"
                                        disabled
                                    />
                                </RadioGroup>
                            </Box>
                        )}
                    </Stack>
                )}
            </Paper>
        </Container>
    );
}
