import {
    Container,
    Box,
    Button,
    Typography,
    Paper,
    Avatar,
    Stack,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserGraduate,
    faChalkboardTeacher,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";

export default function RoleSelectPage() {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar sx={{ m: 1, bgcolor: "grey.500" }}>
                        <PersonAddAltIcon />
                    </Avatar>
                    <Typography
                        component="h1"
                        variant="h5"
                        align="center"
                        gutterBottom
                    >
                        회원가입
                    </Typography>
                </Box>
                <Stack spacing={2} mt={3}>
                    <Button
                        type="button"
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate("student")}
                        size="large"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            paddingY: 2,
                            fontSize: "1rem",
                            backgroundColor: "#4DD0E1",
                            color: "white",
                            "&:hover": {
                                backgroundColor: "#00ACC1",
                            },
                        }}
                    >
                        <FontAwesomeIcon icon={faUserGraduate} size="2x" />
                        <Typography
                            variant="body1"
                            component="div"
                            textAlign="center"
                        >
                            학생 회원가입
                        </Typography>
                    </Button>

                    <Button
                        type="button"
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate("educator")}
                        size="large"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            paddingY: 2,
                            fontSize: "1rem",
                            backgroundColor: "#81C784",
                            color: "white",
                            "&:hover": {
                                backgroundColor: "#388E3C",
                            },
                        }}
                    >
                        <FontAwesomeIcon icon={faChalkboardTeacher} size="2x" />
                        <Typography
                            variant="body1"
                            component="div"
                            textAlign="center"
                        >
                            강사 회원가입
                        </Typography>
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}
