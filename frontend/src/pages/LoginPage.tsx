import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../components/ErrorPopup';
import config from '../../backend.config.json';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:${config.BACKEND_PORT}/admin/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (data.error) {
                setError(data.error);
            } else {
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
            <ErrorPopup message={error} onClose={() => setError('')} />
        </div>
    );
};

export default LoginPage;