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
import { useNavigate, useLocation } from "react-router-dom";

export default function QuestionDetailPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const question = location.state?.question;

    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("");
    const [type, setType] = useState("");
    const [score, setScore] = useState("");
    const [choices, setChoices] = useState([]);
    const [answerIndex, setAnswerIndex] = useState(null);

    useEffect(() => {
        if (question) {
            setContent(question.content);
            setType(question.question_type); // key 변경 주의
            setScore(String(question.score));

            if (question.question_type === "CHOICE") {
                setChoices([...question.choices]);

                const index = question.choices.indexOf(question.answer);
                setAnswerIndex(index !== -1 ? index : null);
            } else if (question.question_type === "TRUE_FALSE") {
                setChoices(["참", "거짓"]);
                setAnswerIndex(Number(question.answer));
            }

            setLoading(false);
        }
    }, [question]);

    const getTypeLabel = (type) => {
        switch (type) {
            case "CHOICE":
                return "선다형";
            case "TRUE_FALSE":
                return "진위형";
            default:
                return type;
        }
    };

    const getAnswerDisplay = () => {
        if (type === "CHOICE") {
            return answerIndex != null ? `${answerIndex + 1}번` : "-";
        }
        if (type === "TRUE_FALSE") {
            return answerIndex === 0 ? "참" : answerIndex === 1 ? "거짓" : "-";
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
                        <TextField
                            label="문제 내용"
                            value={content}
                            multiline
                            rows={4}
                            fullWidth
                            InputProps={{ readOnly: true }}
                        />

                        <Box display="flex" gap={2}>
                            <TextField
                                label="문제 유형"
                                value={getTypeLabel(type)}
                                fullWidth
                                InputProps={{ readOnly: true }}
                            />
                            <TextField
                                label="배점"
                                value={score}
                                fullWidth
                                InputProps={{ readOnly: true }}
                            />
                        </Box>

                        {type === "CHOICE" && (
                            <Box>
                                <Typography variant="subtitle1" mb={1}>
                                    선택지
                                </Typography>
                                {choices.map((choice, idx) => (
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
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Box>
                                ))}
                                <Typography variant="body2" mt={1}>
                                    <strong>정답 번호:</strong>{" "}
                                    {getAnswerDisplay()}
                                </Typography>
                            </Box>
                        )}

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
