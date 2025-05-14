import { createContext, useEffect, useState } from "react";
import { checkAuth } from "../api/auth";

// 빈 Context 생성
const AuthContext = createContext(null);

// Context 값 관리할 컴포넌트
export const AuthProvider = ({ children }) => {
    // 인증 상태 state
    const [authenticated, setAuthenticated] = useState(null);

    // 사용자 정보 state
    const [user, setUser] = useState(null);

    // 컴포넌트가 Mount 될 때 한 번만 실행
    useEffect(() => {
        checkAuth()
            .then((res) => {
                setAuthenticated(true);
                setUser(res.data);
            }) // 인증 확인 성공 -> true, 사용자 정보 저장
            .catch(() => {
                setAuthenticated(false);
                setUser(null);
            }); // 인증 확인 실패 -> false, 사용자 정보 null
    }, []);

    // 자식 컴포넌트들에게 Context 제공
    return (
        // value : 자식 컴포넌트들에게 전달할 것을 객체로 담아서 전달
        <AuthContext.Provider value={{ authenticated, setAuthenticated, user }}>
            {/* 인증 산태 state가 null이면(인증 확인 중), Loading... 렌더링링 */}
            {/* 인증 상태 state가 null이 아니면(인증 확인 후), 자식 컴포넌트 렌더링 */}
            {authenticated === null ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
