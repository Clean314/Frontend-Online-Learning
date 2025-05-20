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
    OutlinedInput,
} from "@mui/material";
import useAuth from "../../../hooks/auth/useAuth";

const categories = ["프로그래밍", "데이터베이스", "네트워크", "보안", "AI"];
const difficulties = ["EASY", "MEDIUM", "HARD"];

export default function CourseRegister() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        educatorName: "",
        category: "",
        difficulty: "",
        description: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: POST api 호출

        console.log("등록할 강의 정보:", formData);
        alert("새 강의가 등록되었습니다.");
        navigate("/teach/myCourses");
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                NEW
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
                <TextField
                    label="강의명"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <FormControl fullWidth>
                    <InputLabel shrink>강사</InputLabel>
                    <OutlinedInput value={user.name} label="강사" readOnly />
                </FormControl>
                <FormControl required>
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
                <FormControl required>
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
                    label="상세 설명"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
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
                        onClick={() => navigate("/courses")}
                    >
                        취소
                    </Button>
                    <Button
                        type="submit"
                        size="large"
                        variant="contained"
                        color="primary"
                    >
                        등록
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}
