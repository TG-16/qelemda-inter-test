import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, List, User } from 'lucide-react';

const Layout = () => {
    const { provider, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="navbar">
                <div className="container flex justify-between items-center">
                    <Link to="/dashboard" className="text-xl font-bold text-primary flex items-center gap-2">
                        <LayoutDashboard size={24} />
                        ServiceCatalog
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-muted flex items-center gap-2">
                            <User size={18} />
                            {provider?.company_name}
                        </span>
                        <button onClick={handleLogout} className="btn btn-outline text-sm text-danger">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </nav>
            <main className="container mt-4">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
