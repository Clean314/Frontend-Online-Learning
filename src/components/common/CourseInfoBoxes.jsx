import { Box, Typography } from "@mui/material";

/**
 * 강의 기본 정보 박스(강사/카테고리/난이도/학점)
 * @param {{ label: string, value: string|number }[]} items
 */
export default function CourseInfoBoxes({ items }) {
    return (
        <Box display="flex" gap={2} mb={3}>
            {items.map((item) => (
                <Box
                    key={item.label}
                    sx={{
                        flex: 1,
                        bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                                ? theme.palette.grey[800]
                                : theme.palette.grey[100],
                        p: 2,
                        borderRadius: 1,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="overline" display="block" gutterBottom>
                        {item.label}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {item.value}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}
