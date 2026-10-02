import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface Props {
    children : ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    if(!token || !user || user.role !== "admin") {
        return <Navigate to="/login" replace />;
    }
    if(user.role !== "admin") {
        return children;
    }

    return children;
}
export default ProtectedRoute;