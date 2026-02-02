import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for token on mount
        const token = localStorage.getItem('token');
        const storedProvider = localStorage.getItem('provider');
        if (token && storedProvider) {
            setProvider(JSON.parse(storedProvider));
        }
        setLoading(false);
    }, []);

    const login = (data) => {
        // data should contain { token, provider }
        localStorage.setItem('token', data.token);
        localStorage.setItem('provider', JSON.stringify(data.provider));
        setProvider(data.provider);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('provider');
        setProvider(null);
    };

    return (
        <AuthContext.Provider value={{ provider, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
