import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { provider, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!provider) return <Navigate to="/login" replace />;

    return <Outlet />;
};

export default ProtectedRoute;
