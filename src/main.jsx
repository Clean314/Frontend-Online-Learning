import ReactDOM from "react-dom/client";
import { Root } from "./components/Root";

// 프로덕션 모드에서 React의 개발 경고 비활성화
if (process.env.NODE_ENV === "production") {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
