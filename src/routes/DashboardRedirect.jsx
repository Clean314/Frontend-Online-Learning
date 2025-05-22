import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/auth/useAuth";

export default function DashboardRedirect() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!user) {
        // 로그인 안 된 상태면 로그인 페이지로
        return <Navigate to="/login" replace />;
    }

    // ADMIN 계정은 /admin/dashboard
    if (user.role === "ADMIN") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // 나머지(EDUCATOR, STUDENT) 계정은 기존 /dashboard
    return <Navigate to="/dashboard" replace />;
}
