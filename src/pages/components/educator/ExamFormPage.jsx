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
dayjs.locale("ko");

export default function ExamFormPage() {
    const { courseId, examId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const existingExam = location.state?.exam;

    const isEditMode = Boolean(examId);

    // ─── 기본값을 모드에 따라 분기 설정 ─────────────────────────────────────────
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
            setStartTime(dayjs(existingExam.startTime));
            setEndTime(dayjs(existingExam.endTime));
            setLoading(false);
        }
    }, [isEditMode, existingExam]);

    const handleSubmit = async () => {
        setError("");

        if (!title.trim()) {
            setError("제목을 입력해주세요.");
            return;
        }
        // 시작 시각은 반드시 현재 시각 이후여야 함
        if (startTime.isBefore(dayjs())) {
            setError("시작 시각은 현재 시각보다 이후여야 합니다.");
            return;
        }
        // 종료 시각은 시작 시각 이후여야 함
        if (endTime.isBefore(startTime)) {
            setError("종료 시각은 시작 시각보다 이후여야 합니다.");
            return;
        }
        // 종료 시각은 시작 시각으로부터 최대 6시간 이내여야 함
        if (endTime.isAfter(startTime.add(6, "hour"))) {
            setError(
                "종료 시각은 시작 시각으로부터 6시간을 초과할 수 없습니다."
            );
            return;
        }

        const payload = {
            title,
            description,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
        };

        if (isEditMode) {
            // TODO: updateExamAPI 호출
            console.log("수정 데이터:", payload);
        } else {
            // TODO: createExamAPI 호출
            console.log("생성 데이터:", payload);
        }
        navigate(`/courses/${courseId}/classroom/teach/exams`);
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
                                    onChange={(newVal) => setStartTime(newVal)}
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
                                    onChange={(newVal) => setEndTime(newVal)}
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
