import {
    Container,
    Paper,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/common/BackButton";
import { useEffect, useState } from "react";
import { getQuestionListAPI } from "../../api/question";
import StudentAnswerCard from "../../components/exam_score/StudentAnswerCard";

export default function IndividualExamResult() {
    const { courseId, examId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { totalScore, student } = location.state || {};
    const myResult = student;

    const [questionMap, setQuestionMap] = useState({});
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [courseId, examId]);

    const handleBack = () => {
        navigate(`/courses/${courseId}/classroom/teach/exams/${examId}/scores`);
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
                        : {myResult.totalScore} / {totalScore ?? 0}점
                    </Typography>
                </Box>

                {loading ? (
                    <Box textAlign="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : (
                    student.answers.map((item, idx) => {
                        const question = questionMap[item.questionId];
                        return (
                            <StudentAnswerCard
                                key={idx}
                                index={idx}
                                question={question}
                                answer={item}
                            />
                        );
                    })
                )}
            </Paper>
        </Container>
    );
}
