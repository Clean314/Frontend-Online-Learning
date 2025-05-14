import { useContext } from "react";
import AuthContext from "./AuthProvider";

// useContext로 AuthContext 값 꺼내 쓰는 커스텀 훅 생성 for 편의
const useAuth = () => useContext(AuthContext);

export default useAuth;
