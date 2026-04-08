import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../components/ErrorPopup';
import { useState, useEffect } from 'react';
import config from '../../backend.config.json';
import { getStore, putStore } from '../api';
import type { Presentation, Slide } from '../types';

const Dashboard = () => {
    const [error, setError] = useState('');
    const [presentations, setPresentations] = useState<Presentation[]>([]);
    const [newName, setNewName] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newDescription, setNewDescription] = useState('');
    const [newThumbnail, setNewThumbnail] = useState('');
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

    const generateId = (): string =>{
        return `${Date.now()}-${Math.random().toString(16).slice(2,9)}`;
    }

    const handleCreate = async () => {
        try {
            const store = await getStore();
            const defaultSlide: Slide = {
                id: generateId(),
                elements: [],
                background: {
                    type: 'solid',
                    value: '#ffffff'
                }
            };
            const newPresentation: Presentation ={
                id: generateId(),
                name: newName.trim() || 'Untitled Presentation',
                description: newDescription.trim() || '',
                thumbnail: newThumbnail.trim() || '',
                slides: [defaultSlide],
                defaultBackground: {
                    type: 'solid',
                    value: '#ffffff'
                }
            }
            const updatedStore = {
                ...store,
                presentations: [...store.presentations, newPresentation],
            }
            await putStore(updatedStore);
            setPresentations(updatedStore.presentations);
            setShowCreateModal(false);
            setNewName('');
            setNewDescription('');
            setNewThumbnail('');
        } catch (error) {
            setError('Failed to create presentation. Please try again.');
        }
    }

    const handleThumbnailFile =(e : React.ChangeEvent<HTMLInputElement>) =>{
        const file =e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewThumbnail(reader.result as string);
        };
        reader.readAsDataURL(file);
    
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
            <ErrorPopup message={error} onClose={() => setError('')} />
        </div>
    );
};

export default Dashboard;