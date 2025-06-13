import React, { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    TextField,
    Stack,
    CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useNavigate, useParams, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { createExamAPI, modifyExamAPI } from "../../../api/exam";
dayjs.locale("ko");

export default function ExamFormPage() {
    const { courseId, examId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const existingExam = location.state?.exam;

    const isEditMode = Boolean(examId);

    // ─── 기본값을 모드에 따라 분기 설정 ──────
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState(
        !isEditMode
            ? dayjs().add(1, "day") // 새 시험 생성 시: 내일
            : dayjs() // 수정 모드: 초기값(로딩 중 스피너)
    );
    const [endTime, setEndTime] = useState(
        !isEditMode
            ? dayjs().add(1, "day").add(1, "hour") // 새 시험 생성 시: 내일 + 1시간
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

        const now = dayjs();

        if (!title.trim()) {
            setError("제목을 입력해주세요.");
            return;
        }

        if (startTime.isBefore(now.add(24, "hour"))) {
            setError("시험 시작 시각은 지금부터 24시간 이후여야 합니다.");
            return;
        }

        if (endTime.isBefore(startTime)) {
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
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),

            // 새 시험 생성일 경우, questions에 빈 값 전달
            // 시험 수정일 경우, 기존 questions 데이터 그대로 전달
            questions: isEditMode ? existingExam.questions : [],

            // 수정 모드일 경우, status 필드 추가
            ...(isEditMode && { status: existingExam.status }),
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
                serverMsg ?? "시험 저장 중 알 수 없는 오류가 발생했습니다."
            );
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <Container sx={{ mb: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" mb={2}>
                        {isEditMode ? "시험 수정" : "새 시험 생성"}
                    </Typography>

                    {loading ? (
                        <Box textAlign="center" py={5}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Stack spacing={2}>
                            <TextField
                                label="시험 제목"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="시험 설명"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows={3}
                                fullWidth
                            />
                            <Box
                                display={"flex"}
                                flexDirection={{ xs: "column", sm: "row" }}
                                gap={2}
                            >
                                <DateTimePicker
                                    label="시작 시각"
                                    value={startTime}
                                    // 최소 현재 시간으로부터 24시간 후
                                    minDateTime={dayjs().add(24, "hour")}
                                    views={[
                                        "year",
                                        "month",
                                        "day",
                                        "hours",
                                        "minutes",
                                    ]}
                                    minutesStep={5}
                                    onChange={(newVal) =>
                                        setStartTime(newVal.second(0))
                                    }
                                    inputFormat="YYYY.MM.DD A hh:mm"
                                    mask="____.__.__ _ __:__"
                                    slotProps={{
                                        textField: { fullWidth: true },
                                        dialog: {
                                            disableEnforceFocus: true,
                                            disableRestoreFocus: true,
                                        },
                                    }}
                                />
                                <DateTimePicker
                                    label="종료 시각"
                                    value={endTime}
                                    // 시작 시간보다 항상 뒤
                                    minDateTime={startTime.add(5, "minute")}
                                    views={[
                                        "year",
                                        "month",
                                        "day",
                                        "hours",
                                        "minutes",
                                    ]}
                                    minutesStep={5}
                                    onChange={(newVal) =>
                                        setEndTime(newVal.second(0))
                                    }
                                    inputFormat="YYYY.MM.DD A hh:mm"
                                    mask="____.__.__ _ __:__"
                                    slotProps={{
                                        textField: { fullWidth: true },
                                        dialog: {
                                            disableEnforceFocus: true,
                                            disableRestoreFocus: true,
                                        },
                                    }}
                                />
                            </Box>

                            {error && (
                                <Typography color="error" variant="body2">
                                    {error}
                                </Typography>
                            )}

                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                mt={2}
                            >
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
                                >
                                    저장
                                </Button>
                            </Box>
                        </Stack>
                    )}
                </Paper>
            </Container>
        </LocalizationProvider>
    );
}
