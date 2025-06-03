import { memo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../hooks/auth/AuthProvider";

// 메모이제이션된 App 래퍼 컴포넌트
export const AppWrapper = memo(({ theme, children }) => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
            <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
    </ThemeProvider>
));
