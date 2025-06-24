import { useState, useEffect } from "react";
import { Container, Paper } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { createExamAPI, modifyExamAPI } from "../../api/exam";
import ExamFormHeader from "../../components/exam_form/ExamFormHeader";
import ExamFormFields from "../../components/exam_form/ExamFormFields";
import ExamFormActions from "../../components/exam_form/ExamFormActions";

dayjs.locale("ko");

export default function ExamForm() {
    const { courseId, examId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const existingExam = location.state?.exam;

    const isEditMode = Boolean(examId);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // 현재 시각 기준 5분 단위로 올림
    const roundToFiveMinutes = (d) =>
        d.minute(Math.ceil(d.minute() / 5) * 5).second(0);
    const [startTime, setStartTime] = useState(
        !isEditMode
            ? roundToFiveMinutes(dayjs().add(1, "day")) // 새 시험 생성 시: 내일
            : dayjs() // 수정 모드: 초기값(로딩 중 스피너)
    );
    const [endTime, setEndTime] = useState(
        !isEditMode
            ? roundToFiveMinutes(dayjs().add(1, "day").add(1, "hour")) // 새 시험 생성 시: 내일 + 1시간
            : dayjs().add(1, "hour") // 수정 모드: 초기값(로딩 중 스피너)
    );
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isEditMode && existingExam) {
            setTitle(existingExam.title);
            setDescription(existingExam.description);
            setStartTime(dayjs(existingExam.start_time));
            setEndTime(dayjs(existingExam.end_time));
            setLoading(false);
        }
    }, [isEditMode, existingExam]);

    const handleSubmit = async () => {
        setError("");

        const now = dayjs().startOf("minute"); // 초까지 고려하지 않고 분 단위까지만 비교

        if (!title.trim()) {
            setError("제목을 입력해주세요.");
            return;
        }

        if (startTime.isBefore(now.add(24, "hour"))) {
            setError("시험 시작 시각은 지금부터 24시간 이후여야 합니다.");
            return;
        }

        if (endTime.isBefore(startTime) || endTime.isSame(startTime)) {
            setError("종료 시각은 시작 시각보다 이후여야 합니다.");
            return;
        }

        if (endTime.diff(startTime, "hour") > 6) {
            setError(
                "시험 시간은 시작 시각으로부터 최대 6시간 이내여야 합니다."
            );
            return;
        }

        const payload = {
            title,
            description,
            start_time: startTime.format("YYYY-MM-DDTHH:mm:ss"),
            end_time: endTime.format("YYYY-MM-DDTHH:mm:ss"),
            ...(isEditMode && { status: existingExam?.status ?? "PREPARING" }), // 조건부 전송
        };

        try {
            if (isEditMode) {
                await modifyExamAPI(Number(courseId), Number(examId), payload);
                console.log("수정 데이터:", payload);
            } else {
                await createExamAPI(Number(courseId), payload);
                console.log("생성 데이터:", payload);
            }
            navigate(`/courses/${courseId}/classroom/teach/exams`);
        } catch (err) {
            console.error("시험 저장 실패:", err);

            const serverMsg = err.response?.data;
            setError(
                typeof serverMsg === "string"
                    ? serverMsg
                    : (serverMsg?.detail ??
                          "시험 저장 중 알 수 없는 오류가 발생했습니다.")
            );
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <Container sx={{ mb: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <ExamFormHeader isEditMode={isEditMode} loading={loading} />
                    {!loading && (
                        <>
                            <ExamFormFields
                                title={title}
                                description={description}
                                startTime={startTime}
                                endTime={endTime}
                                setTitle={setTitle}
                                setDescription={setDescription}
                                setStartTime={setStartTime}
                                setEndTime={setEndTime}
                                error={error}
                            />
                            <ExamFormActions
                                onCancel={() => navigate(-1)}
                                onSubmit={handleSubmit}
                            />
                        </>
                    )}
                </Paper>
            </Container>
        </LocalizationProvider>
    );
}
