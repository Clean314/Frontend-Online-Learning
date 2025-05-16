import { createContext, useEffect, useState } from "react";
import { checkAuth } from "../api/auth";

// 빈 Context 생성
const AuthContext = createContext(null);

// Context 값 관리할 컴포넌트
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 로그아웃
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setUser(false);
                setLoading(false);
                return;
            }

            try {
                const userInfo = await checkAuth();
                setUser(userInfo);
            } catch (error) {
                setUser(false);
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        };

        checkToken();
    }, []);

    // 자식 컴포넌트들에게 Context 제공
    return (
        <AuthContext.Provider value={{ loading, user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
