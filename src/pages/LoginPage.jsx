import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Avatar,
    Box,
    Button,
    Container,
    TextField,
    Typography,
    CssBaseline,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import useAuth from "../hooks/auth/useAuth";
import { useTheme } from "@emotion/react";

export default function LoginPage() {
    const theme = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // AuthProvider.login 이 토큰 저장과 setUser 까지 처리
            await login(email, password);

            navigate("/");
        } catch (err) {
            console.log(err);
            alert("일치하는 회원 정보가 존재하지 않습니다.");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: "background.paper",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "grey.500" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    로그인
                </Typography>
                <Box component="form" sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="이메일 주소"
                        type="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="비밀번호"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="button"
                        onClick={handleLogin}
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                        }}
                    >
                        로그인
                    </Button>
                    <Button
                        type="button"
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate("/signup")}
                        sx={{
                            color: theme.palette.primary.dark,
                            "&:hover": {
                                bgcolor: theme.palette.grey[50],
                            },
                        }}
                    >
                        회원가입
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
