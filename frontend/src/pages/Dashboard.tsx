import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../components/ErrorPopup';
import { useState, useEffect } from 'react';
import config from '../../backend.config.json';
import { getStore, putStore } from '../api';
import type { Presentation, Slide } from '../types';

const Dashboard = () => {
    const [error, setError] = useState('');
    const [presentations, setPresentations] = useState<Presentation[]>([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditTitle, setShowEditTitle] = useState(false);
    const [editTitelleValue, setEditTitleValue] = useState('');
    const [showEditThumbnail, setShowEditThumbnail] = useState(false);
    const navigate = useNavigate();

    const fetchPresentations =async () =>{
        try{
            const store =await getStore();
            setPresentations(store.presentations);
        } catch (error) {
            setError('Failed to fetch presentations.');
        }
    };

    useEffect(() => {fetchPresentations()},[]);

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