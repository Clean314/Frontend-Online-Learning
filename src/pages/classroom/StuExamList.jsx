import { useState, useEffect, useRef, useCallback } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
    getStudentExamListAPI,
    getStudentExamScoreAPI,
    startExamAPI,
} from "../../api/exam";
import { getStudentQuestionListAPI } from "../../api/question";
import StuExamTable from "../../components/exam/StuExamTable";

export default function StuExamList() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const refreshTimer = useRef(null);

    // 시험 목록 조회 + 자동 재조회 스케줄링
    const fetchExams = useCallback(async () => {
        clearTimeout(refreshTimer.current);

        try {
            setLoading(true);
            const data = await getStudentExamListAPI(Number(courseId));

            const examList = await Promise.all(
                data.map(async (e) => {
                    const startTime = new Date(e.start_time);
                    const endTime = new Date(e.end_time);

                    let hasTaken = false;
                    let score = 0;
                    let totalScore = 0;
                    let questionCount = 0;

                    try {
                        const result = await getStudentExamScoreAPI(
                            courseId,
                            e.id
                        );
                        if (result) {
                            hasTaken = true;
                            score = result;
                        }
                    } catch (err) {
                        console.error("성적 조회 실패:", err);
                    }

                    try {
                        const questionRes = await getStudentQuestionListAPI(
                            Number(courseId),
                            Number(e.id)
                        );
                        totalScore = questionRes.reduce(
                            (sum, q) => sum + q.score,
                            0
                        );
                        questionCount = questionRes.length;
                    } catch (err) {
                        console.error("총점 계산용 문제 불러오기 실패:", err);
                    }

                    return {
                        id: e.id,
                        title: e.title,
                        startTime,
                        endTime,
                        status: e.status,
                        hasTaken,
                        score,
                        totalScore,
                        questionCount,
                    };
                })
            );

            const sorted = examList.sort((a, b) => a.startTime - b.startTime);
            setExams(sorted);
            setError(null);

            const now = new Date();
            // 시작 예정 시각 목록
            const futureStartTimes = sorted
                .map((ex) => new Date(ex.startTime.getTime() + 1000)) // 시작 직후 1초 후
                .filter((t) => t > now);

            // 종료 예정 시각 목록
            const futureEndTimes = sorted
                .map((ex) => new Date(ex.endTime.getTime() + 1000)) // 종료 직후 1초 후
                .filter((t) => t > now);

            // 두 목록을 합쳐서 가장 가까운 시점 계산
            const futureTimes = [...futureStartTimes, ...futureEndTimes];
            if (futureTimes.length > 0) {
                const next = futureTimes.sort((a, b) => a - b)[0];
                const delay = next - now;
                refreshTimer.current = setTimeout(fetchExams, delay);
            }
        } catch (err) {
            console.error(err);
            setError("시험 목록을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchExams();
        return () => clearTimeout(refreshTimer.current);
    }, [fetchExams]);

    // 응시하기 버튼 핸들러: 시간 재검사
    const handleTakeExam = async (exam) => {
        const now = new Date();
        if (now < exam.startTime || now > exam.endTime) {
            alert("지금은 응시 가능한 시간이 아닙니다.");
            return;
        }

        try {
            await startExamAPI(courseId, exam.id); // 시험 시작 API 호출
            navigate(`${exam.id}/take`, { state: { exam } });
        } catch (err) {
            console.error("시험 시작 실패:", err);
            alert("시험을 시작하는 데 실패했습니다. 관리자에게 문의하세요.");
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h5">시험 목록</Typography>
                </Box>

                {loading ? (
                    <Box textAlign="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <StuExamTable exams={exams} onTakeExam={handleTakeExam} />
                )}
            </Paper>
        </Container>
    );
}
