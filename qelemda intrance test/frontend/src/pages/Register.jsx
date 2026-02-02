import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '', // Assuming full_name maps to username or prompt says full_name
        email: '',
        phone: '',
        password: '',
        companyName: '',
        licenseNumber: ''
    });
    // Note: Backend likely expects specific keys.
    // Prompt says: full_name, email, phone, password, company_name, license_number
    // I will map them accordingly in handleSubmit or rename state.

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const payload = {
            name: formData.username, // mapping to backend expectation if needed, providerModel says 'name' in createProvider? verify providerModel.js:3 const createProvider = async ({name...})
            // providerModel.js line 3: {name, email, phone, password, companyName, licenseNumber}
            // providerRoute.js line 27: validates then calls register. 
            // Let's assume the controller expects camelCase or snake_case. 
            // providerValidator.js would tell us, but I didn't read it. 
            // Usually safer to match the DB columns or variable names. 
            // providerModel argument uses camelCase.
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            companyName: formData.companyName,
            licenseNumber: formData.licenseNumber
        };

        try {
            const response = await fetch('/api/provider/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen py-10">
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <h2 className="text-2xl text-center mb-4">Provider Registration</h2>
                {error && <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded">{error}</div>}
                {success && <div className="p-3 mb-4 text-sm text-green-800 bg-green-100 rounded">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="label">Full Name</label>
                        <input name="username" className="input" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label className="label">Email</label>
                        <input type="email" name="email" className="input" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label className="label">Phone</label>
                        <input type="tel" name="phone" className="input" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label className="label">Password</label>
                        <input type="password" name="password" className="input" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label className="label">Company Name</label>
                        <input name="companyName" className="input" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label className="label">License Number</label>
                        <input name="licenseNumber" className="input" onChange={handleChange} required />
                    </div>

                    <button type="submit" className="btn btn-primary w-full" style={{ width: '100%' }} disabled={isLoading}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-muted">
                        Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
