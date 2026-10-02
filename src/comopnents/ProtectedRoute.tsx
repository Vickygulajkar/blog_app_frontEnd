import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
    children : ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    if(!token || !user) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
export default ProtectedRoute;