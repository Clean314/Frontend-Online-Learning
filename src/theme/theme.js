import { createTheme } from "@mui/material";

// 테마 설정
export const getTheme = (mode) =>
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
        components: {
            MuiButton: {
                defaultProps: {
                    disableRipple: true, // 리플 효과 비활성화로 성능 향상
                },
            },
        },
    });
