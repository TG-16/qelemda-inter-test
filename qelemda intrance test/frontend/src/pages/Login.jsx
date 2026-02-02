import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/provider/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            login(data); // data should be { token, provider }
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-2xl text-center mb-4">Provider Login</h2>
                {error && <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full" style={{ width: '100%' }} disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-muted">
                        Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
