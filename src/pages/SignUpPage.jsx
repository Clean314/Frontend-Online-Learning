import React, { useState } from "react";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Avatar,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // TODO: 유효성 검사
            // TODO: 회운가입 요청 API

            alert("회원가입이 완료되었습니다!");
            navigate("/login");
        } catch (err) {
            alert("회원가입 실패: " + err.message);
        }
    };

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
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="이름"
                        name="name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="이메일"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="비밀번호"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                    >
                        회원가입
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        sx={{ mt: 1 }}
                        onClick={() => navigate("/login")}
                    >
                        로그인으로 돌아가기
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
