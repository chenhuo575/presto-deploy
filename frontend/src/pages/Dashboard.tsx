import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../components/ErrorPopup';
import { useState } from 'react';
import config from '../../backend.config.json';

const Dashboard = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:${config.BACKEND_PORT}/admin/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            localStorage.removeItem('token');
            navigate('/');
        } catch {
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
            <ErrorPopup message={error} onClose={() => setError('')} />
        </div>
    );
};

export default Dashboard;