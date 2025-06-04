import { useState, useCallback } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import CategorySelect from "../../components/course/CategorySelect";
import CourseNameField from "../../components/course/CourseNameField";
import CreditSelect from "../../components/course/CreditSelect";
import DifficultySelect from "../../components/course/DifficultySelect";
import MaxEnrollmentField from "../../components/course/MaxEnrollmentField";
import DescriptionField from "../../components/course/DescriptionField";
import ActionButtons from "../../components/course/ActionButtons";

import { createCourseAPI } from "../../api/course";

export default function EduCourseRegister() {
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
    const handleChange = useCallback((e) => {
        const { name, value, type } = e.target;
        const parsed = type === "number" ? Number(value) : value;

        if (name === "max_enrollment") {
            setFormData((prev) => ({
                ...prev,
                max_enrollment: parsed,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: parsed,
            }));
        }
    }, []);

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
                    <CategorySelect
                        value={formData.category}
                        onChange={handleChange}
                    />
                    <CourseNameField
                        value={formData.course_name}
                        onChange={handleChange}
                    />
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                    <CreditSelect
                        value={formData.point}
                        onChange={handleChange}
                    />
                    <DifficultySelect
                        value={formData.difficulty}
                        onChange={handleChange}
                    />
                    <MaxEnrollmentField
                        value={formData.max_enrollment}
                        onChange={handleChange}
                    />
                </Box>

                <DescriptionField
                    value={formData.description}
                    onChange={handleChange}
                />

                <ActionButtons />
            </Box>
        </Paper>
    );
}
