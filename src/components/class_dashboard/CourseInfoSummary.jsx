import { Box, Typography, Button, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

/**
 * 강의 기본 정보 요약 표시 컴포넌트
 *
 * @param courseInfo -- 강의 정보 객체 (title, educator_name, category, difficulty, description 등)
 * @param onEditClick -- "강의 기본 정보 편집" 버튼 클릭 시 호출되는 함수
 * @param editButtonRef -- 포커스를 제어하기 위한 버튼 ref (모달 닫힐 때 복귀용)
 * @param role -- 사용자 역할 (예: "EDUCATOR", "STUDENT")
 */
export default function CourseInfoSummary({
    courseInfo,
    onEditClick,
    editButtonRef,
    role = "STUDENT", // 기본값 STUDENT
}) {
    const theme = useTheme();

    return (
        <>
            {/* 상단 헤더 */}
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ borderBottom: 1, borderColor: "divider", pb: 1, mb: 3 }}
            >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {courseInfo.title || courseInfo.course_name}
                </Typography>

                {/* 편집 버튼: EDUCATOR일 때만 표시 */}
                {role === "EDUCATOR" && (
                    <Button
                        ref={editButtonRef}
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={onEditClick}
                    >
                        강의 기본 정보 편집
                    </Button>
                )}
            </Box>

            {/* 강사명, 카테고리, 난이도 */}
            <Box display="flex" gap={2} mb={3}>
                {[
                    { label: "강사명", value: courseInfo.educator_name },
                    { label: "카테고리", value: courseInfo.category },
                    { label: "난이도", value: courseInfo.difficulty },
                ].map((item) => (
                    <Box
                        key={item.label}
                        sx={{
                            flex: 1,
                            bgcolor:
                                theme.palette.mode === "dark"
                                    ? theme.palette.grey[800]
                                    : theme.palette.grey[100],
                            p: 2,
                            borderRadius: 1,
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            variant="overline"
                            display="block"
                            gutterBottom
                        >
                            {item.label}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 500 }}
                        >
                            {item.value}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* 강의 설명 */}
            <Typography variant="body1" color="text.secondary" mb={4}>
                {courseInfo.description}
            </Typography>
        </>
    );
}
