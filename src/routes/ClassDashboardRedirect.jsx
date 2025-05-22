import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/auth/useAuth";

export default function ClassDashboardRedirect() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!user) {
        // 로그인 안 된 상태면 로그인 페이지로
        return <Navigate to="/login" replace />;
    }

    if (user.role === "EDUCATOR") {
        return <Navigate to="teach/dashboard" replace />;
    }

    if (user.role === "STUDENT") {
        return <Navigate to="learn/dashboard" replace />;
    }
}
