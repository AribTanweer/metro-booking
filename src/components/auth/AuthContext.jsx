/**
 * AuthContext
 * Provides simple frontend mock authentication state management.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../ui/Toast';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        // Check session storage on mount
        const storedAuth = sessionStorage.getItem('metro_admin_auth');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = async (password) => {
        // Simple mock authentication (password: admin123)
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                if (password === 'admin123') {
                    setIsAuthenticated(true);
                    sessionStorage.setItem('metro_admin_auth', 'true');
                    showToast('Successfully logged in as Admin', 'success');
                    resolve(true);
                } else {
                    showToast('Invalid password', 'error');
                    resolve(false);
                }
            }, 800);
        });
    };

    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('metro_admin_auth');
        showToast('Logged out successfully', 'info');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
