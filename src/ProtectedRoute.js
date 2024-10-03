import { Outlet, Navigate } from "react-router-dom"
import Swal from "sweetalert2";
// Creating a protected route function
const ProtectedRoute = ({ user }) => {
    if (!user) {
        Swal.fire('Access Denied', 'You must be logged in to view this page', 'error');
        return <Navigate to="/" />;
    }
    return <Outlet />;
}

export default ProtectedRoute