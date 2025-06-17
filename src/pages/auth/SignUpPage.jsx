import { useState } from "react";
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
    faChalkboardTeacher,
    faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signupAPI } from "../../api/auth";
import { useTheme } from "@emotion/react";

export default function SignUpPage() {
    const theme = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const [emailError, setEmailError] = useState("");
    const [generalError, setGeneralError] = useState("");

    const navigate = useNavigate();
    const { role } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError("");
        setGeneralError("");

        try {
            await signupAPI({
                email,
                password,
                name,
                role: role.toUpperCase(),
                description: "",
            });

            alert("회원가입이 완료되었습니다!");
            navigate("/login");
        } catch (err) {
            console.error(err);

            if (err.response) {
                if (err.response.status === 409) {
                    // 중복 이메일
                    setEmailError(
                        err.response.data || "이미 사용 중인 이메일입니다."
                    );
                } else {
                    // 그 외 서버 에러
                    setGeneralError(
                        err.response.data || "회원가입 중 오류가 발생했습니다."
                    );
                }
            } else {
                setGeneralError("네트워크 오류가 발생했습니다.");
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                    mb={1}
                >
                    <FontAwesomeIcon
                        icon={
                            role === "student"
                                ? faUserGraduate
                                : faChalkboardTeacher
                        }
                        size="lg"
                    />
                    <Typography component="h1" variant="h5">
                        {role === "student" ? "학생" : "강사"} 회원가입
                    </Typography>
                </Box>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="이름"
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="이메일"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={Boolean(emailError)}
                        helperText={emailError}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="비밀번호"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {generalError && (
                        <Typography
                            color="error"
                            variant="body2"
                            sx={{ mt: 1 }}
                        >
                            {generalError}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                    >
                        회원가입
                    </Button>
                    <Button
                        type="button"
                        fullWidth
                        variant="text"
                        sx={{
                            mt: 1,
                            color: theme.palette.primary.dark,
                            "&:hover": {
                                color: theme.palette.primary.main,
                            },
                        }}
                        onClick={() => navigate("/login")}
                    >
                        로그인으로 돌아가기
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
