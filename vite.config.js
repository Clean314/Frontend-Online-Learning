import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite 설정 파일
export default defineConfig({
    plugins: [react()],
    build: {
        target: "esnext",
        minify: "terser",
        terserOptions: {
            compress: {
                // 프로덕션 빌드에서 console.log 제거
                drop_console: true,
                // 프로덕션 빌드에서 디버거 구문 제거
                drop_debugger: true,
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    // React 관련 라이브러리를 별도의 청크로 분리
                    "react-vendor": ["react", "react-dom", "react-router-dom"],
                    // Material-UI 관련 라이브러리를 별도의 청크로 분리
                    "mui-vendor": ["@mui/material", "@mui/icons-material"],
                },
            },
        },
    },
    server: {
        // 개발 서버 시작 시 브라우저 자동 실행
        open: true,
        // 모든 네트워크 인터페이스에서 접근 가능하도록 설정
        host: true,
    },
});
