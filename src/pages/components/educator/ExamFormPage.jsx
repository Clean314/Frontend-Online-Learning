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
// MUI X DateTimePicker 및 LocalizationProvider, 어댑터(import 경로 주의)
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useNavigate, useParams, useLocation } from "react-router-dom";
import dayjs from "dayjs";

export default function ExamFormPage() {
    const { courseId, examId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const isEditMode = Boolean(examId);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState(dayjs());
    const [endTime, setEndTime] = useState(dayjs().add(1, "hour"));
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isEditMode) {
            // TODO: API 호출 구현 필요 (getExamByIdAPI)
            // 임시 데이터로 수정 모드 화면 테스트
            const dummyExam = {
                title: "기말고사 수정",
                description: "2025년 기말고사 시험입니다.",
                startTime: "2025-07-15T14:00:00",
                endTime: "2025-07-15T16:00:00",
            };
            setTimeout(() => {
                setTitle(dummyExam.title);
                setDescription(dummyExam.description);
                setStartTime(dayjs(dummyExam.startTime));
                setEndTime(dayjs(dummyExam.endTime));
                setLoading(false);
            }, 500);
        }
    }, [courseId, examId, isEditMode]);

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError("제목을 입력해주세요.");
            return;
        }
        if (endTime.isBefore(startTime)) {
            setError("종료 시각은 시작 시각보다 이후여야 합니다.");
            return;
        }

        const payload = {
            title,
            description,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
        };

        if (isEditMode) {
            // TODO: API 호출 구현 필요 (updateExamAPI)
            console.log("수정 데이터:", payload);
        } else {
            // TODO: API 호출 구현 필요 (createExamAPI)
            console.log("생성 데이터:", payload);
        }
        navigate(`/courses/${courseId}/exams`);
    };

    return (
        // LocalizationProvider로 감싸야 DateTimePicker가 동작합니다.
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container sx={{ mt: 4, mb: 4 }}>
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
                                    slotProps={{
                                        textField: { fullWidth: true },
                                        dialog: {
                                            // 포커스 트랩 기능 비활성화
                                            disableEnforceFocus: true,
                                            disableRestoreFocus: true,
                                        },
                                    }}
                                />
                                <DateTimePicker
                                    label="종료 시각"
                                    value={endTime}
                                    onChange={(newVal) => setEndTime(newVal)}
                                    slotProps={{
                                        textField: { fullWidth: true },
                                        dialog: {
                                            // 포커스 트랩 기능 비활성화
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
