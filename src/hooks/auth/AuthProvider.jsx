import { createContext, useEffect, useState } from "react";
import { checkAuthAPI, loginAPI } from "../../api/auth";

// 빈 Context 생성
const AuthContext = createContext(null);

// Context 값 관리할 컴포넌트
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 로그인
    const login = async (email, password) => {
        // 토큰 저장 for 로그인 유지
        const token = await loginAPI(email, password);
        sessionStorage.setItem("token", token);

        // user 업데이트
        const userInfo = await checkAuthAPI();
        setUser(userInfo);
    };

    // 로그아웃
    const logout = () => {
        sessionStorage.removeItem("token");
        setUser(null);
    };

    // 페이지 이동, 리렌더링으로 인한 user 상태 초기화 문제 예방
    // 컴포넌트 마운트 시, 토큰 확인 -> user 값 설정
    useEffect(() => {
        const checkToken = async () => {
            const token = sessionStorage.getItem("token");

            if (token) {
                try {
                    const userInfo = await checkAuthAPI();
                    setUser(userInfo);
                } catch {
                    logout();
                }
            }

            setLoading(false);
        };

        checkToken();
    }, []);

    // 자식 컴포넌트들에게 Context 제공
    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
