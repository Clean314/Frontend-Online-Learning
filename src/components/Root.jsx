import { useMemo, useState } from "react";
import { ColorModeContext } from "../ColorModeContext";
import { AppWrapper } from "./AppWrapper";
import App from "../App";
import { getTheme } from "../theme/theme";

// 루트 컴포넌트
export function Root() {
    const [mode, setMode] = useState("light");

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () =>
                setMode((prev) => (prev === "light" ? "dark" : "light")),
        }),
        []
    );

    const theme = useMemo(() => getTheme(mode), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <AppWrapper theme={theme}>
                <App />
            </AppWrapper>
        </ColorModeContext.Provider>
    );
}
