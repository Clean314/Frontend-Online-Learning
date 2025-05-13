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

export default function SignUpPage() {
    const navigate = useNavigate();

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
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
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate("/signup/student")}
                        size="large"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            paddingY: 2,
                            fontSize: "1rem",
                            backgroundColor: "#99BC85",
                            color: "white",
                            "&:hover": {
                                backgroundColor: "#86AB89",
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
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate("/signup/teacher")}
                        size="large"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            paddingY: 2,
                            fontSize: "1rem",
                            backgroundColor: "#F0BB78",
                            color: "white",
                            "&:hover": {
                                backgroundColor: "#FAAB78",
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
