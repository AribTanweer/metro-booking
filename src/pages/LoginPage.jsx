/**
 * LoginPage
 * Simple login screen for accessing the Admin panel.
 */
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { Lock, ArrowRight, Shield } from 'lucide-react';
import MetroTrainIcon from '../components/ui/MetroTrainIcon';
import './LoginPage.css';

export default function LoginPage() {
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Default redirect to admin if they came directly, else to where they tried to go
    const from = location.state?.from?.pathname || '/admin';

    // If already logged in, redirect away from login
    if (isAuthenticated) {
        navigate(from, { replace: true });
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password.trim()) return;

        setIsSubmitting(true);
        const success = await login(password);
        setIsSubmitting(false);

        if (success) {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="login-page animate-fade-in">
            <div className="login-container card">
                <div className="login-header">
                    <div className="login-logo-container">
                        <MetroTrainIcon size={48} className="login-logo" />
                        <div className="shield-badge">
                            <Shield size={16} />
                        </div>
                    </div>
                    <h1>Admin Access</h1>
                    <p className="text-secondary">Enter the administration password to continue.</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-with-icon">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                disabled={isSubmitting}
                                autoFocus
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`btn btn-primary btn-full ${isSubmitting ? 'loading' : ''}`}
                        disabled={!password.trim() || isSubmitting}
                    >
                        {isSubmitting ? 'Verifying...' : (
                            <>
                                Authenticate
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
