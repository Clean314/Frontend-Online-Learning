import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    TextField,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { createCourseAPI } from "../../../api/course";

// TODO: 카테고리 목록을 API로부터 동적으로 가져오도록 수정
const categories = ["프로그래밍", "데이터베이스", "네트워크", "보안", "AI"];
// TODO: 난이도 옵션을 API 연동하여 관리
const difficulties = ["EASY", "MEDIUM", "HARD"];
// TODO: 학점 데이터도 API에서 받아오도록 변경
const credits = [1, 2, 3];

export default function CourseRegister() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        course_name: "",
        point: "",
        category: "",
        difficulty: "",
        description: "",
        max_enrollment: "",
    });

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const parsed = type === "number" ? Number(value) : value;

        if (name === "max_enrollment") {
            // max_enrollment가 바뀔 때마다 available_enrollment도 동일하게 세팅
            setFormData((prev) => ({
                ...prev,
                max_enrollment: parsed,
                available_enrollment: parsed,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: parsed,
            }));
        }
    };

    // 강의 등록 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const courseId = await createCourseAPI(formData);

            navigate(`/teach/courses/new/${courseId}/curriculum`);
        } catch (err) {
            console.error("강의 등록 실패:", err);
            alert("강의 등록에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                개요
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl sx={{ width: "auto", minWidth: 200 }} required>
                        <InputLabel>카테고리</InputLabel>
                        <Select
                            label="카테고리"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
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
                        name="course_name"
                        value={formData.course_name}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl fullWidth required>
                        <InputLabel>학점</InputLabel>
                        <Select
                            label="학점"
                            name="point"
                            value={formData.point}
                            onChange={handleChange}
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
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                        >
                            {difficulties.map((level) => (
                                <MenuItem key={level} value={level}>
                                    {level}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="최대 수강 인원"
                        name="max_enrollment"
                        type="number"
                        value={formData.max_enrollment}
                        onChange={handleChange}
                        fullWidth
                        required
                        slotProps={{
                            htmlInput: { min: 10, max: 100 },
                        }}
                        helperText="최소 10명, 최대 100명까지 입력 가능합니다."
                    />
                </Box>

                <TextField
                    label="상세 설명"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={7}
                />

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        justifyContent: "center",
                        mt: 2,
                    }}
                >
                    <Button
                        size="large"
                        variant="outlined"
                        onClick={() => navigate("/teach/courses/my")}
                    >
                        취소
                    </Button>
                    <Button
                        type="submit"
                        size="large"
                        variant="contained"
                        color="primary"
                    >
                        다음
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}
