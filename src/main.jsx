import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./hooks/auth/AuthProvider";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo, useState } from "react";
import { ColorModeContext } from "./ColorModeContext";

function Root() {
    const [mode, setMode] = useState("light");

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () =>
                setMode((prev) => (prev === "light" ? "dark" : "light")),
        }),
        []
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        light: "#AFDDFF", // 밝은 하늘색
                        main: "#4DD0E1", // 민트빛 청록
                        dark: "#00ACC1", // 진한 청록
                        contrastText: "#fff",
                    },
                    secondary: {
                        light: "#D3E671", // 은은한 연녹
                        main: "#81C784", // 파스텔 그린
                        dark: "#388E3C", // 진한 숲녹
                        contrastText: "#fff",
                    },
                },
            }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />

                <BrowserRouter>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </BrowserRouter>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
