import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Stack,
    useTheme,
} from "@mui/material";
import useAuth from "../../../hooks/auth/useAuth";

export default function CourseEdit() {
    const { user } = useAuth();
    const theme = useTheme();

    const { courseId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [courseName, setCourseName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [point, setPoint] = useState(0);
    const [maxEnrollment, setMaxEnrollment] = useState(0);

    const categories = ["프로그래밍", "데이터베이스", "네트워크", "보안", "AI"];
    const difficulties = ["EASY", "MEDIUM", "HARD"];
    const credits = [1, 2, 3];

    useEffect(() => {
        // TODO: 실제 API 대신 임시 mock 데이터 세팅
        const mockCourse = {
            course_name: `강의 ${courseId}`,
            educator_name: user.name,
            description: `강의 ${courseId}의 기존 상세 설명입니다.`,
            category: categories[0],
            difficulty: difficulties[0],
            point: credits[0],
            max_enrollment: 30,
            available_enrollment: 30,
        };

        setCourseName(mockCourse.course_name);
        setDescription(mockCourse.description);
        setCategory(mockCourse.category);
        setDifficulty(mockCourse.difficulty);
        setPoint(mockCourse.point);
        setMaxEnrollment(mockCourse.max_enrollment);
        setLoading(false);
    }, [courseId, user.role, navigate]);

    const handleSave = () => {
        if (!courseName.trim()) {
            alert("강의명을 입력해주세요.");
            return;
        }

        // TODO: 강의 정보 수정 API

        alert("강의 정보가 업데이트되었습니다. (임시 처리)");
        navigate(`/courses/${courseId}`);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (loading) {
        return <Typography>로딩 중...</Typography>;
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                강의 정보 수정
            </Typography>
            <Stack spacing={3}>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl sx={{ minWidth: 200 }} required>
                        <InputLabel>카테고리</InputLabel>
                        <Select
                            label="카테고리"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="강의명"
                        fullWidth
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        required
                    />
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl fullWidth required>
                        <InputLabel>학점</InputLabel>
                        <Select
                            label="학점"
                            value={point}
                            onChange={(e) => setPoint(Number(e.target.value))}
                        >
                            {credits.map((c) => (
                                <MenuItem key={c} value={c}>
                                    {c}학점
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth required>
                        <InputLabel>난이도</InputLabel>
                        <Select
                            label="난이도"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                        >
                            {difficulties.map((d) => (
                                <MenuItem key={d} value={d}>
                                    {d}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="최대 수강 인원"
                        type="number"
                        fullWidth
                        slotProps={{
                            htmlInput: { min: 10, max: 100 },
                        }}
                        helperText="최소 10명, 최대 100명까지 입력 가능합니다."
                        value={maxEnrollment}
                        onChange={(e) =>
                            setMaxEnrollment(Number(e.target.value))
                        }
                        required
                    />
                </Box>

                <TextField
                    label="상세 설명"
                    multiline
                    minRows={4}
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                        mt: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        sx={{ color: theme.palette.primary.dark }}
                    >
                        취소
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: theme.palette.primary.main }}
                        onClick={handleSave}
                    >
                        저장
                    </Button>
                </Box>
            </Stack>
        </Paper>
    );
}
