import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import SignUpPage from "./pages/sign_up/SignUpPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import StudentSignUp from "./pages/sign_up/StudentSignUp";
import EducatorSignUp from "./pages/sign_up/EducatorSignUp";

function App() {
    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/signup/student" element={<StudentSignUp />} />
                <Route path="/signup/teacher" element={<EducatorSignUp />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
