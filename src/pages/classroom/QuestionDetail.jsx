import { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    Stack,
    CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import ReadOnlyTextField from "../../components/question/ReadOnlyTextField";
import ChoiceDetail from "../../components/question/ChoiceDetail";
import TrueFalseDetail from "../../components/question/TrueFalseDetail";

export default function QuestionDetail() {
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
            setType(question.question_type);
            setScore(String(question.score));

            setChoices([...question.choices]);

            if (question.question_type === "CHOICE") {
                const index = question.choices.indexOf(question.answer);
                setAnswerIndex(index !== -1 ? index : null);
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

    return (
        <Container sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <BackButton onClick={() => navigate(-1)} />
                    <Typography variant="h5">문제 상세 조회</Typography>
                </Box>

                {loading ? (
                    <Box textAlign="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        <ReadOnlyTextField
                            label="문제 내용"
                            value={content}
                            multiline
                        />

                        <Box display="flex" gap={2}>
                            <ReadOnlyTextField
                                label="문제 유형"
                                value={getTypeLabel(type)}
                            />
                            <ReadOnlyTextField label="배점" value={score} />
                        </Box>

                        {type === "CHOICE" && (
                            <ChoiceDetail
                                choices={choices}
                                answerIndex={answerIndex}
                            />
                        )}

                        {type === "TRUE_FALSE" && (
                            <TrueFalseDetail answer={question.answer} />
                        )}
                    </Stack>
                )}
            </Paper>
        </Container>
    );
}
