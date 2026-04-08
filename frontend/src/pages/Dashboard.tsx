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
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Dashboard</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <button onClick={() => setShowCreateModal(true)}>Create New Presentation</button>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px',
            }}>
                {presentations.map((presentation) => (
                    <div 
                        key={presentation.id} 
                        onClick={() => navigate(`/presentation/edit?id=${presentation.id}`)}
                        style={{
                        aspectRatio: '2 / 1',
                        minWidth: '100px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'row',
                        padding: '12px',
                        gap: '12px',
                        backgroundColor: '#1e1e1e',
                        }}>
                        {presentation.thumbnail ? (
                            <img 
                            src={presentation.thumbnail} 
                            alt={presentation.name} 
                            style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            flexShrink: 0,
                            }} /> ):(
                            <div style={{
                                width: '60px',
                                height: '60px',
                                backgroundColor: '#333',
                                borderRadius: '4px',
                                flexShrink: 0,
                            }} />
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            </div>
            <ErrorPopup message={error} onClose={() => setError('')} />
        </div>
    );
};

export default Dashboard;