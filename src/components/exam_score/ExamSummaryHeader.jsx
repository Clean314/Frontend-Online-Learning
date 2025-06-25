import { Box, Typography } from "@mui/material";

/**
 * 시험 요약 정보 영역 (응시자 수, 평균 점수 등)
 *
 * @param {Object} props
 * @param {number} props.totalStudents - 전체 수강생 수
 * @param {number} props.submittedCount - 응시한 학생 수
 * @param {number} props.averageScore - 평균 점수
 * @param {number} props.totalScore - 시험 총점
 */
export default function ExamSummaryHeader({
    totalStudents,
    submittedCount,
    averageScore,
    totalScore,
}) {
    return (
        <Box display="flex" gap={4} mb={2}>
            <Typography>
                <Box component="span" fontWeight="fontWeightBold">
                    응시자 수:
                </Box>{" "}
                {submittedCount} / {totalStudents}
            </Typography>
            <Typography>
                <Box component="span" fontWeight="fontWeightBold">
                    평균 점수:
                </Box>{" "}
                {averageScore} / {totalScore}점
            </Typography>
        </Box>
    );
}
