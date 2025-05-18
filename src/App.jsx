import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import SignUpPage from "./pages/sign_up/SignUpPage";
import RoleSelectPage from "./pages/sign_up/RoleSelectPage";

function App() {
    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<RoleSelectPage />} />
                <Route path="/signup/:role" element={<SignUpPage />} />
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
