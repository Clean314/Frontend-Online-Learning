import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/auth/useAuth";

/**
 * 대시보드 강의 카드 그리드
 * @param {{
 *   courses: Array,
 *   title: string,
 *   moreLink: string
 * }} props
 */
export default function CourseCardGrid({ courses, title, moreLink }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Box
                sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(4, 1fr) 0.5fr", // 고정 비율
                    },
                }}
            >
                {courses.map((course) => (
                    <Card
                        key={course.id}
                        sx={{
                            height: 160,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            borderRadius: 2,
                            overflow: "hidden",
                            bgcolor: (theme) =>
                                theme.palette.mode === "dark"
                                    ? theme.palette.grey[800]
                                    : theme.palette.grey[50],
                        }}
                    >
                        <CardActionArea
                            onClick={() =>
                                navigate(`/courses/${course.id}/classroom`)
                            }
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                p: 3,
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 3,
                                    lineHeight: "1.4em",
                                    maxHeight: "4.2em",
                                }}
                            >
                                {course.name}
                            </Typography>

                            {user?.role === "STUDENT" && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ textAlign: "right" }}
                                >
                                    {course.educator_name}
                                </Typography>
                            )}

                            <Typography
                                variant="caption"
                                color="primary"
                                sx={{ textAlign: "right", fontWeight: 500 }}
                            >
                                강의실로 이동 →
                            </Typography>
                        </CardActionArea>
                    </Card>
                ))}
                <CardActionArea
                    onClick={() => navigate(moreLink)}
                    sx={{
                        height: 160,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography variant="button">MORE &gt;</Typography>
                </CardActionArea>
            </Box>
        </Box>
    );
}
